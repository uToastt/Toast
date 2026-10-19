import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Toast | Revenant SMP",
  description:
    "Minecraft stories by Toast. Watch the latest videos and discover Revenant SMP.",
  icons: {
    icon: "/favicon.jpg",
  },
};

export const viewport: Viewport = {
  themeColor: "#14110c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}