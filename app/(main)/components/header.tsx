"use client";

import Image from "next/image";
import {
  MenuIcon,
  SearchIcon,
  Spinner,
  UserIcon,
  UserIconLoggedOut,
} from "../../assets/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/app/supabase";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [dialog, setDialog] = useState<boolean | null>(false);
  const [loading, setLoading] = useState(true);
  const activeClass = ({ isActive }: { isActive: boolean }): string =>
    `${
      isActive ? "text-orange-500" : "text-inherit"
    } hover:text-orange-500 font-bold transition-colors hidden sm:flex`;

  const pathName = usePathname();
  const router = useRouter();

  function useOutsideClick<T extends HTMLElement>(callback: () => void) {
    const ref = useRef<T | null>(null);

    useEffect(() => {
      function handleClick(event: MouseEvent) {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          callback();
        }
      }

      document.addEventListener("click", handleClick);
      return () => {
        document.removeEventListener("click", handleClick);
      };
    }, [callback]);

    return ref;
  }

  function handleDialogOutside() {
    setDialog(false);
  }

  const ref = useOutsideClick<HTMLUListElement>(handleDialogOutside);

  function gotoAccounts() {
    router.push("/auth/login");
  }

  function handleLogOut() {
    supabase.auth.signOut();
    setDialog(false);
  }

  function handleUserProfile() {
    router.push("/profile");
    setDialog(false);
  }

  useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
        console.log(user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (_event === "SIGNED_OUT" || !session) {
          setUser(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="z-10 fixed top-0 bg-white  w-full sm:border-l-4 border-l-orange-500 dark:bg-neutral-900 border-b dark:border-b-neutral-800 border-b-neutral-300">
      <div className="p-2 sm:p-3 lg:p-4 flex justify-between">
        <div className="sm:hidden flex items-center gap-2">
          <div className="flex items-center cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-700 p-1.5 rounded-4xl justify-center transition-color">
            <MenuIcon
              width={30}
              height={30}
              fill="fill-neutral-500 dark:fill-neutral-400"
            />
          </div>
        </div>

        <nav className="flex items-center gap-4 group">
          <Link href="/" className="flex items-center gap-2">
            <Image
              width={92}
              height={92}
              title="Blogsy"
              src="/logo.png"
              alt=""
              className="h-9 sm:h-10 w-auto sm:hover:scale-105 transition-transform"
            />
            <h1 className="sm:hidden text-2xl font-bold hover:text-orange-500 active:text-orange-600 transition-colors">
              Blogsy
            </h1>
          </Link>

          <Link
            className={activeClass({ isActive: pathName === "/" })}
            href="/"
          >
            Home
          </Link>
          <Link
            className={activeClass({ isActive: pathName === "/posts" })}
            href="/posts"
          >
            Posts
          </Link>
          <Link
            className={activeClass({ isActive: pathName === "/about" })}
            href="/about"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden  sm:flex items-center gap-1 dark:bg-neutral-800 bg-neutral-200 p-1.5 rounded-4xl">
            <div className="flex items-center cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-700 p-1 rounded-4xl transition-all ">
              <SearchIcon
                width={24}
                height={24}
                fill="fill-neutral-500 dark:fill-neutral-400"
              />
            </div>
            <input
              type="text"
              className="outline-none"
              placeholder="Search..."
            />
          </div>
          <div
            className="flex items-center cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-700 p-1.5 rounded-4xl justify-center transition-all"
            onClick={
              user
                ? () => setDialog(!dialog)
                : loading
                ? () => {}
                : gotoAccounts
            }
          >
            {user ? (
              <UserIcon
                width={30}
                height={30}
                fill="fill-neutral-500 dark:fill-neutral-400"
              />
            ) : loading ? (
              <Spinner
                width={30}
                height={30}
                fill="fill-neutral-500 dark:fill-neutral-400"
              />
            ) : (
              <UserIconLoggedOut
                width={30}
                height={30}
                fill="fill-neutral-500 dark:fill-neutral-400"
              />
            )}
          </div>
          {dialog && (
            <ul ref={ref} className="bg-neutral-300 min-w-40 fixed top-14 right-2 sm:top-16 sm:right-6 dark:bg-neutral-900 shadow-md rounded-xl border-1 border-neutral-800">
              <li className="text-sm sm:text-base py-3 px-4 rounded-t-xl transition-colors  dark:hover:bg-neutral-950 cursor-pointer font-semibold">
                {user?.email}
              </li>
              <li
                className="text-sm sm:text-base py-3 px-4 transition-colors dark:hover:bg-neutral-950  cursor-pointer font-semibold"
                onClick={handleUserProfile}
              >
                My Profile
              </li>

              <li
                className="text-sm sm:text-base py-3 px-4 rounded-b-xl transition-colors dark:hover:bg-neutral-950  cursor-pointer font-semibold"
                onClick={handleLogOut}
              >
                LogOut
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
