import type { Platoon, PlatoonsMap } from "$lib/types";
import { readFile } from "$lib/s3";
import { createError } from "$lib/api-error";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, setHeaders }) {
	const { platform, platoon: platoonId } = params;
	const data = <string>await readFile(`${platform}/__platoons.json`);
	const map: PlatoonsMap = data ? JSON.parse(data) : {};
	const platoon: Platoon = map[platoonId];
	if (!platoon) return createError(404, "Platoon not found");
	setHeaders({ "Cache-Control": "public, max-age=3600" });
	return json(platoon);
}