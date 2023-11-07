import Statuses from "http-status";
import { error } from "@sveltejs/kit";

export function createError(status: number, message = Statuses[status]) {
	return new Response(
		JSON.stringify({ error: message }),
		{
			status: status,
			statusText: Statuses[status],
			headers: {
				"Content-Type": "application/json"
			}
		}
	)
}

export async function handleNotOk(response: Response) {
	if (response.headers.get("Content-Type")?.startsWith("application/json")) {
		const json = await response.json();
		throw error(response.status, json.error || json);
	} else {
		throw error(response.status, Statuses[response.status]);
	}
}