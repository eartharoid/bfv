export function asJSON(data: BodyInit) {
	return new Response(data, {
		headers: {
			"Content-Type": "application/json"
		}
	});
}
