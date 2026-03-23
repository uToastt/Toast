import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Taost | Minecraft YouTuber",
  description:
    "Welcome to the official website of Taost - Minecraft content creator, gaming enthusiast, and community builder. Part of the Dystopian Universe.",
  keywords: ["Minecraft", "YouTuber", "Gaming", "Taost", "Content Creator", "Dystopian Universe"],
  openGraph: {
    title: "Taost | Minecraft YouTuber",
    description:
      "Welcome to the official website of Taost - Minecraft content creator, gaming enthusiast, and community builder. Part of the Dystopian Universe.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FACC15",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
