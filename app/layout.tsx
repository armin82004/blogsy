
import { connection } from "next/server";
import "./globals.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connection()
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`flex flex-col min-h-screen dark:bg-neutral-800 dark:text-neutral-100 overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
