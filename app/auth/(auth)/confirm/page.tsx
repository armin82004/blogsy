'use client'
import { useRouter } from "next/navigation";

export default function Confirm() {
  const router = useRouter()
  return (
    <div className="select-none flex flex-col justify-center items-center h-screen w-screen sm:h-auto sm:max-w-xl  md:max-w-2xl bg-gradient-to-b from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-900 rounded-none sm:rounded-2xl shadow-2xl p-4 sm:p-12 gap-4">
      <h1 className="text-3xl font-bold">Email Verified 🎉</h1>
      <p className="text-neutral-600 dark:text-neutral-300">
        Your email has been successfully verified. You can now log in to Blogsy.
      </p>
      <button
        onClick={() => router.push("/auth/login")}
        className="px-4 py-2 bg-orange-500 hover:bg-amber-700 text-white rounded-xl cursor-pointer transition-all"
      >
        Go to Login
      </button>
    </div>
  );
}
