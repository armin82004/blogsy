"use client";

import { ErrorIcon } from "@/app/assets/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function PostToaster() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("deleteError");

  useEffect(() => {
    if (error) {
      toast.custom((t) => (
        <div
          className={`flex gap-2 py-4 px-4 max-w-2xl bg-red-600 my-2 text-white rounded-full ${
            t.visible && "animate-ease animate-fade-down"
          }`}
        >
          <span>
            <ErrorIcon width={24} height={24} fill="dark:fill-neutral-100" />
          </span>
          <p>{error}</p>
        </div>
      ));
      router.replace(window.location.pathname);
    }
  }, [error, router]);
  return <Toaster />;
}
