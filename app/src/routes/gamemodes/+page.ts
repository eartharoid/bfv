import type { GameModes } from "$lib/types";
import { handleNotOk } from "$lib/api-error.js";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const response = await fetch('/api/gamemodes');
	if (!response.ok) throw await handleNotOk(response);
	const gamemodes: GameModes = await response.json();
	return { gamemodes };
}
