import type { Platoon } from "$lib/types";
import { handleNotOk } from "$lib/api-error.js";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const { platform, platoon: platoonId } = params;
	const response = await fetch(`/api/${platform}/platoons/${platoonId}`);
	if (!response.ok) throw await handleNotOk(response);
	const platoon: Platoon = await response.json()
	return { platoon };
}