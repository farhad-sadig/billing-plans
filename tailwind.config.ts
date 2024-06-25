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
				focused:
					"0px 0px 0px 4px rgba(68, 76, 231, 0.12), 0px 1px 2px 0 rgba(16, 24, 40, 0.05), 0px 0px 0px 1px rgba(68, 76, 231, 1)",
				"error-focused":
					"0px 0px 0px 4px rgba(217, 45, 32, 0.12), 0px 0px 0px 1px rgba(217, 45, 32, 1)"
			}
		}
	},
	plugins: []
};
export default config;
