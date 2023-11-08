import { ls } from "$lib/s3";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	const { platform } = params;
	const { folders } = await ls(`${platform}/players/`);
	const players = folders.map(({ Prefix }) => decodeURIComponent((<string>Prefix).split("/")[2]));
	return json(players);
}
