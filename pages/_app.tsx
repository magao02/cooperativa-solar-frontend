import type { AppProps } from "next/app";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { fontSans, fontMono } from "@/config/fonts";
import {useRouter} from 'next/router';
import "@/styles/globals.css";
import Menu from "@/components/menu";
import { Toaster } from "sonner";


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
	

	return (
		<NextUIProvider navigate={router.push}>
			<Toaster invert richColors/>
			<NextThemesProvider  forcedTheme="light">
			<Menu />
				<Component {...pageProps} />
			</NextThemesProvider>
		</NextUIProvider>
	);
}

export const fonts = {
	sans: fontSans.style.fontFamily,
	mono: fontMono.style.fontFamily,
};
