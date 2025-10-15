"use client";
import { redirect } from "next/navigation";
import "../../../app/globals.css";
import { supabase } from "@/app/supabase";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [userStatus, setUserStatus] = useState(false);
  useEffect(() => {
    async function checkLogin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserStatus(false);
        redirect("/");
      } else {
        setUserStatus(true);
      }
    }

    checkLogin();
  }, []);
  return (
    <>
      <main className="flex justify-center items-center from-orange-400 to-orange-600 flex-col min-h-screen overflow-x-hidden bg-gradient-to-b h-screen dark:from-neutral-800 dark:to-neutral-950 dark:text-neutral-100 ">
        {userStatus && children}
      </main>
    </>
  );
}
