import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Revenant SMP | Toast",
  description:
    "Minecraft stories by Toast. Watch the videos and discover Revenant SMP at rs.taostt.com.",
  icons: {
    icon: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
  openGraph: {
    title: "Revenant SMP | Toast",
    description: "Watch the stories. Join the next chapter.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0e0d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}