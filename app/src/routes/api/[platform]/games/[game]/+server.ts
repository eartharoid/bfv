import type { GameReport } from "$lib/types.js";
import { fileExists, readFile, writeFile } from "$lib/s3";
import { createError } from "$lib/api-error";
import { HeaderFactory } from "$lib/headers.js";
import { getAuthentication } from "$lib/auth.js";
import { ZGameReport } from "$lib/schemas.js";
import { json } from "@sveltejs/kit";
import { gunzip } from "$lib/gzip.js";
import { gzipSync, strToU8 } from "fflate"; // instead of node:zlib to work natively in Workers

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, setHeaders }) {
	const { platform, game } = params;
	const key = `${platform}/games/${platform}-${game}.json.gz`;
	const data = <ReadableStream | null>await readFile(key, { as: "stream" });
	if (!data) return createError(404, "No data");
	HeaderFactory(setHeaders).json().cache();
	return new Response(gunzip(data));
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, params }) {
	const { platform, game } = params;

	// only allow authorised users to write data
	const auth = await getAuthentication(request);
	if (!auth) return createError(401);

	const key = `${platform}/games/${platform}-${game}.json.gz`;
	if (await fileExists(key)) return createError(409);

	const parsed = ZGameReport.safeParse(await request.json());
	if (!parsed.success) return createError(400, parsed.error.issues);
	const data: GameReport = Object.assign(
		{
			$metadata: {
				lastUpdatedAt: new Date().toISOString(),
				lastUpdatedBy: auth.sub
			}
		},
		parsed.data
	);

	await writeFile(key, gzipSync(strToU8(JSON.stringify(data))));

	return json(data);
}
