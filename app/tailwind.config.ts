import plugin from "tailwindcss/plugin";
import type { Config } from "tailwindcss";

export default <Config>{
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			colors: {
				xbox: "#107C10"
			},
			textShadow: {
				sm: "0 2px 4px var(--tw-shadow-color)",
				DEFAULT: "0 4px 8px var(--tw-shadow-color)",
				lg: "0 6px 12px var(--tw-shadow-color)",
				xl: "0 6px 18px var(--tw-shadow-color)"
			}
		}
	},
	plugins: [
		plugin(function ({ matchUtilities, theme }) {
			matchUtilities(
				{
					"text-shadow": (value) => ({
						textShadow: value
					})
				},
				{ values: theme("textShadow") }
			);
		})
	]
};
