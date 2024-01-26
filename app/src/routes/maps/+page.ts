import type { Maps } from "$lib/types";
import { handleNotOk } from "$lib/api-error.js";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const response = await fetch('/api/maps');
	if (!response.ok) throw await handleNotOk(response);
	const maps: Maps = await response.json();
	return { maps };
}
