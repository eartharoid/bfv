import { handleNotOk } from "$lib/api-error.js";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const { platform } = params;
	const response = await fetch(`/api/${platform}/players`);
	if (!response.ok) throw await handleNotOk(response);
	const players: string[] = await response.json();
	return { players };
}
