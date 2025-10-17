import { connection } from "next/server";
import "./globals.css";
import Script from "next/script";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connection();
  return (
    <html lang="en" className="scroll-smooth">
      <Script src="https://accounts.google.com/gsi/client" async />
      <body
        className={`flex flex-col min-h-screen dark:bg-neutral-800 dark:text-neutral-100 overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
