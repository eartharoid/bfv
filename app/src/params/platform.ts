/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
	const params = ["xbl", "psn", "origin"];
	return params.includes(param);
}
