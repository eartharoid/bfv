import { readFile } from "$lib/s3";
import { createError } from "$lib/api-error";
import { HeaderFactory } from "$lib/headers.js";
import { gunzip } from "$lib/gzip.js";

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, setHeaders }) {
	const { platform, platoon: platoonId } = params;
	const data = <ReadableStream | null>(
		await readFile(`${platform}/platoons/${platoonId}/platoon.json.gz`, { as: "stream" })
	);
	if (!data) return createError(404, "Platoon not found");
	HeaderFactory(setHeaders).json().cache();
	return new Response(gunzip(data));
}
