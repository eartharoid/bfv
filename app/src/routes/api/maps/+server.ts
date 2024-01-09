import type { Map, Maps } from "$lib/types.js";
import { readFile, writeFile } from "$lib/s3";
import { createError } from "$lib/api-error";
import { HeaderFactory } from "$lib/headers.js";
import { getAuthentication } from "$lib/auth.js";
import { ZMap } from "$lib/schemas.js";
import { json } from "@sveltejs/kit";
import { gunzip } from "$lib/gzip.js";
import { gzipSync, strToU8 } from "fflate"; // instead of node:zlib to work natively in Workers

const key = `__meta/maps.json.gz`;

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

	const parsed = ZMap.safeParse(await request.json());
	if (!parsed.success) return createError(400, parsed.error.issues);
	const data: Map = Object.assign(
		{
			$metadata: {
				lastUpdatedAt: new Date().toISOString(),
				lastUpdatedBy: auth.sub
			}
		},
		parsed.data
	);
	const file = <ReadableStream>await readFile(key, { as: "stream" });
	const maps: Maps = await new Response(gunzip(file)).json();

	// eslint-disable-next-line no-prototype-builtins
	if (maps.hasOwnProperty(data.key)) return createError(409);

	maps[data.key] = data;
	await writeFile(key, gzipSync(strToU8(JSON.stringify(maps))));

	return json(maps);
}
