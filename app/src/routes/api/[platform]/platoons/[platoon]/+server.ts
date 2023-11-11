import type { Platoon, PlatoonSummary, TRNPlatform } from "$lib/types";
import { readFile, writeFile } from "$lib/s3";
import { createError } from "$lib/api-error";
import { HeaderFactory } from "$lib/headers.js";
import { gunzip } from "$lib/gzip.js";
import { getAuthentication, checkAuthorisation } from "$lib/auth.js";
import { ZPlatoon, ZPlatoonSummary } from "$lib/schemas.js";
import { json } from "@sveltejs/kit";
import { gzipSync, strToU8 } from "fflate";

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, setHeaders }) {
	const { platform, platoon: platoonId } = params;
	const key = `${platform}/platoons/${platoonId}/platoon.json.gz`;
	const data = <ReadableStream | null>await readFile(key, { as: "stream" });
	if (!data) return createError(404, "Platoon not found");
	HeaderFactory(setHeaders).json().cache();
	return new Response(gunzip(data));
}

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, params }) {
	const { platform, platoon: platoonId } = params;

	// only allow authorised users to write data
	const auth = await getAuthentication(request);
	if (!auth) return createError(401);
	const against = {
		type: "platoon" as const,
		id: platoonId,
		platform: <TRNPlatform>params.platform
	};
	if (!(await checkAuthorisation(against, auth))) return createError(403);

	const parsed = ZPlatoon.safeParse(await request.json());
	if (!parsed.success) return createError(400, parsed.error.issues);
	const data: Platoon = Object.assign(
		{
			$metadata: {
				lastUpdatedAt: new Date().toISOString(),
				lastUpdatedBy: auth.sub
			}
		},
		parsed.data
	);

	const key1 = `${platform}/__platoons.json.gz`;
	const index: PlatoonSummary[] = await new Response(
		gunzip(<ReadableStream>await readFile(key1, { as: "stream" }))
	).json();

	const existing = index.find((platoon) => platoon.id === platoonId);

	if (existing) {
		// remove members and servers
		const parsed = ZPlatoonSummary.safeParse(data);
		if (!parsed.success) return createError(400, parsed.error.issues);
		const summary: PlatoonSummary = parsed.data;
		const str1 = JSON.stringify(existing);
		const str2 = JSON.stringify(summary);
		if (str1 !== str2) {
			index[index.indexOf(existing)] = summary;
			await writeFile(key1, gzipSync(strToU8(JSON.stringify(index))));
		}
	}

	const key2 = `${platform}/platoons/${platoonId}/platoon.json.gz`;
	await writeFile(key2, gzipSync(strToU8(JSON.stringify(data))));

	return json({ success: true });
}
