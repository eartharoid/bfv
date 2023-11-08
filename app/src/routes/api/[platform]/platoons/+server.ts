import type { Platoon, PlatoonsMap } from "$lib/types";
import { readFile } from "$lib/s3";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	const { platform } = params;
	const data = <string>await readFile(`${platform}/__platoons.json`);
	const map: PlatoonsMap = data ? JSON.parse(data) : {};
	const platoons = Object.values(map).map((platoon: Partial<Platoon>) => {
		delete platoon.members;
		delete platoon.servers;
		return platoon;
	});
	return json(platoons);
}
