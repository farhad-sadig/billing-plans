import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}"
	],
	theme: {
		screens: {
			desktop: "1280px",
			tablet: "768px",
			mobile: "375px"
		},
		extend: {
			boxShadow: {
				"custom-blue": "0px 0px 0px 4px rgba(68, 76, 231, 0.12)"
			}
		}
	},
	plugins: []
};
export default config;
