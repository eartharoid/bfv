import { readFile } from "$lib/s3";
import { HeaderFactory } from "$lib/headers.js";
import { gunzip } from "$lib/gzip.js";

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, setHeaders }) {
	const { platform } = params;
	const data = <ReadableStream>await readFile(`${platform}/__platoons.json.gz`, { as: "stream" });
	HeaderFactory(setHeaders).json().cache();
	// browsers support gzip but it doesn't work internally with SvelteKit
	return new Response(gunzip(data));
}
