import "@/app/globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="bg-neutral-200 overflow-x-hidden  h-screen dark:bg-neutral-900 dark:text-neutral-100 p-6 ">
        {children}
      </main>
    </>
  );
}
