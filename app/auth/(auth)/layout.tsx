import "../../../app/globals.css";

export const metadata = {
  title: "Blogsy | Login / Signup",
  description:
    "Access or create your Blogsy account to post, comment, and manage your profile.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  
  return (
    <>
      <main className="flex justify-center items-center from-orange-400 to-orange-600 flex-col min-h-screen overflow-x-hidden bg-gradient-to-b h-screen dark:from-neutral-800 dark:to-neutral-950 dark:text-neutral-100 min-w-screen container ">
        {children}
      </main>
    </>
  );
}
