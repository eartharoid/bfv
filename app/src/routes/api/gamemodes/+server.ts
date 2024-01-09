import type { GameMode, GameModes } from "$lib/types.js";
import { readFile, writeFile } from "$lib/s3";
import { createError } from "$lib/api-error";
import { HeaderFactory } from "$lib/headers.js";
import { getAuthentication } from "$lib/auth.js";
import { ZGameMode } from "$lib/schemas.js";
import { json } from "@sveltejs/kit";
import { gunzip } from "$lib/gzip.js";
import { gzipSync, strToU8 } from "fflate"; // instead of node:zlib to work natively in Workers

const key = `__meta/modes.json.gz`;

/** @type {import('./$types').RequestHandler} */
export async function GET({ setHeaders }) {
	const data = <ReadableStream | null>await readFile(key, { as: "stream" });
	if (!data) return createError(404, "No data");
	HeaderFactory(setHeaders).json().cache();
	return new Response(gunzip(data));
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	// only allow authorised users to write data
	const auth = await getAuthentication(request);
	if (!auth) return createError(401);

	const parsed = ZGameMode.safeParse(await request.json());
	if (!parsed.success) return createError(400, parsed.error.issues);
	const data: GameMode = Object.assign(
		{
			$metadata: {
				lastUpdatedAt: new Date().toISOString(),
				lastUpdatedBy: auth.sub
			}
		},
		parsed.data
	);
	const file = <ReadableStream>await readFile(key, { as: "stream" });
	const modes: GameModes = await new Response(gunzip(file)).json();

	// eslint-disable-next-line no-prototype-builtins
	if (modes.hasOwnProperty(data.key)) return createError(409);

	modes[data.key] = data;
	await writeFile(key, gzipSync(strToU8(JSON.stringify(modes))));

	return json(modes);
}
