"use client";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
interface ProviderProps {
	children: React.ReactNode;
}

export default function UIProvider({ children }: ProviderProps) {
	const router = useRouter();

	return <NextUIProvider navigate={router.push}>{children}</NextUIProvider>;
}
