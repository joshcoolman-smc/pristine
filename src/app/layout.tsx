import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pristine",
  description: "A clean, well ordered starting point",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
