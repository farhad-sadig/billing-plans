import type { Metadata } from "next";
import "./globals.css";
import { PlanProvider } from "@/context/PlanContext";
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
				<PlanProvider>{children}</PlanProvider>
			</body>
		</html>
	);
}
