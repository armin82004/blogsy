import "@/app/globals.css";

export const metadata = {
  title: "Blogsy | Create a Post",
  description:
    "Create a new Blogsy post to share your thoughts, tutorials, and insights with the technology and AI community.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="bg-neutral-200 overflow-x-hidden  h-screen dark:bg-neutral-900 dark:text-neutral-100 p-6 ">
        {children}
      </main>
    </>
  );
}
