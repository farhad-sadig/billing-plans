import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
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
	plugins: [nextui()]
};
export default config;
