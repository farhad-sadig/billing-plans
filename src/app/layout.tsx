import type { Metadata } from "next";
import CombinedProvider from "./providers/CombinedProvider";
import "./globals.css";

export const metadata: Metadata = {
	title: "Billing Plans"
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<CombinedProvider>{children}</CombinedProvider>
			</body>
		</html>
	);
}
