import { ls } from "$lib/s3";
import { HeaderFactory } from "$lib/headers.js";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, setHeaders }) {
	const { platform } = params;
	const { objects } = await ls(`${platform}/games/`);
	const games = objects.map(({ Key }) => Key?.split("/")[2].split("-")[1].split(".")[0]); // remove folders, prefix, extension
	HeaderFactory(setHeaders).cache(); // json is used below instead
	return json(games);
}
