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
  title: "Toast | Minecraft YouTuber",
  description:
    "Welcome to the official website of Toast - Minecraft content creator, gaming enthusiast, and community builder. Part of the Dystopian Universe.",
  keywords: ["Minecraft", "YouTuber", "Gaming", "Toast", "Content Creator", "Dystopian Universe"],
  icons: {
    icon: "https://yt3.googleusercontent.com/NyVQ_LhL1IT67IE7ljjIcOLqHdKqMgPn5F7GW8SvMgpGRyLkNqFC-dqOWPs0QGMgVvmTsB_G=s176-c-k-c0x00ffffff-no-rj",
    apple: "https://yt3.googleusercontent.com/NyVQ_LhL1IT67IE7ljjIcOLqHdKqMgPn5F7GW8SvMgpGRyLkNqFC-dqOWPs0QGMgVvmTsB_G=s176-c-k-c0x00ffffff-no-rj",
  },
  openGraph: {
    title: "Toast | Minecraft YouTuber",
    description:
      "Welcome to the official website of Toast - Minecraft content creator, gaming enthusiast, and community builder. Part of the Dystopian Universe.",
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
