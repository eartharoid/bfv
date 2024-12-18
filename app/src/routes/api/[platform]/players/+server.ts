import { HeaderFactory } from "$lib/headers.js";
import { ls } from "$lib/s3";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, setHeaders }) {
	const { platform } = params;
	const { folders } = await ls(`${platform}/players/`);
	const players = folders.map(({ Prefix }) => decodeURIComponent((<string>Prefix).split("/")[2]));
	HeaderFactory(setHeaders).cache(); // not .json() because SvelteKit's json() helper is used below
	return json(players);
}
