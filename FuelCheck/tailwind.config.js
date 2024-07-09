import withMT from "@material-tailwind/react/utils/withMT";

const config = withMT({
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: "#0C0E0F",
				secondary: "#09E09B",
				tertiary: "#073b3a",
			}
		},
	},
	plugins: [],
});

export default config;