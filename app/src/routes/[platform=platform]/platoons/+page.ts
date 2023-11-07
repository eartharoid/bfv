import type { Platoon } from "$lib/types";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const { platform } = params;
	const platoons: Partial<Platoon>[] = await (await fetch(`/api/${platform}/platoons`)).json()
	return { platoons };
}
