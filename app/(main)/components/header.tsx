"use client";

import Image from "next/image";
import {
  ExploreIcon,
  HomeIcon,
  MenuIcon,
  PeopleIcon,
  PostIcon,
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
import { createClient } from "@/app/utils/supabase/client";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [dialog, setDialog] = useState<boolean | null>(false);
  const [loading, setLoading] = useState(true);
  const [ProfileImg, setProfileImg] = useState<string | null>("");
  const [menu, setMenu] = useState(false);

  const activeClass = ({ isActive }: { isActive: boolean }): string =>
    `${
      isActive ? "text-orange-500" : "text-inherit"
    } hover:text-orange-500 font-bold transition-colors hidden sm:flex`;

  const activeClassMb = ({ isActive }: { isActive: boolean }): string =>
    `${
      isActive
        ? "dark:text-white dark:fill-white"
        : "text-neutral-600 dark:text-neutral-400 fill-neutral-600 dark:fill-neutral-400"
    }  font-bold transition-colors flex  dark:group-hover:fill-white group-hover:fill-black transition-all `;
  const pathName = usePathname();
  const router = useRouter();

  const supabase = createClient();
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

    async function fetchProfileImg() {
      if (!user) return;
      const { data } = await supabase
        .from("authors")
        .select("profile_img")
        .eq("id", user.id)
        .single();

      setProfileImg(data?.profile_img || "");
    }

    fetchProfileImg();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [user]);

  return (
    <>
      {menu && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-20"
          onClick={() => setMenu(false)}
        ></div>
      )}
      <div
        className={`sm:hidden h-screen max-w-5/8 bg-white dark:bg-neutral-900 fixed top-0 z-30 transition-all duration-400 flex flex-col ${
          menu ? "left-0" : "-left-full"
        }`}
      >
        <ul>
          <div className="flex items-center gap-1 dark:bg-neutral-800 bg-neutral-200 px-4 shadow-md py-2 m-2 rounded-md ">
            <input
              type="text"
              className="outline-none w-8/9"
              placeholder="Search..."
            />
            <div className="flex items-center cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-700 p-1 rounded-4xl transition-all ">
              <SearchIcon
                width={26}
                height={26}
                fill="fill-neutral-500 dark:fill-neutral-400"
              />
            </div>
          </div>
          <li className="text-sm sm:text-base hover:bg-neutral-300 transition-all  dark:hover:bg-neutral-800 cursor-pointer group rounded-md p-2.5 m-1 ">
            <Link
              className={
                activeClassMb({ isActive: pathName === "/" }) +
                "  flex items-center gap-1"
              }
              href="/"
              onClick={() => setMenu(false)}
            >
              <div className="flex p-1">
                <HomeIcon
                  width={23}
                  height={23}
                  fill={activeClassMb({ isActive: pathName === "/" })}
                />
              </div>
              <p className="group-hover:text-black transition-colors dark:group-hover:text-white font-bold text-base">
                Home
              </p>
            </Link>
          </li>
          <li className="text-sm sm:text-base hover:bg-neutral-300 transition-all  dark:hover:bg-neutral-800 cursor-pointer group rounded-md p-2.5 m-1 ">
            <Link
              className={
                activeClassMb({ isActive: pathName === "/posts" }) +
                "  flex items-center gap-1"
              }
              href="/posts"
              onClick={() => setMenu(false)}
            >
              <div className="flex p-1">
                <ExploreIcon
                  width={23}
                  height={23}
                  fill={activeClassMb({ isActive: pathName === "/posts" })}
                />
              </div>
              <p className=" group-hover:text-black dark:group-hover:text-white transition-colors font-bold text-base">
                Posts
              </p>
            </Link>
          </li>

          <li className="text-sm sm:text-base hover:bg-neutral-300 transition-all  dark:hover:bg-neutral-800 cursor-pointer group rounded-md p-2.5 m-1 ">
            <Link
              className={
                activeClassMb({ isActive: pathName === "/about" }) +
                " flex items-center gap-1"
              }
              href="/about"
              onClick={() => setMenu(false)}
            >
              <div className="flex p-1">
                <PeopleIcon
                  width={23}
                  height={23}
                  fill={activeClassMb({ isActive: pathName === "/about" })}
                />
              </div>
              <p className="group-hover:text-black transition-colors dark:group-hover:text-white  font-bold text-base">
                About
              </p>
            </Link>
          </li>
        </ul>
      </div>
      <header className="z-10 fixed top-0 bg-white  w-full sm:border-l-4 border-l-orange-500 dark:bg-neutral-900 border-b dark:border-b-neutral-800 border-b-neutral-300">
        <div className="p-2 sm:p-3 lg:p-4 flex justify-between">
          <div className="sm:hidden flex items-center gap-2">
            <div
              className="flex items-center cursor-pointer hover:bg-neutral-300 dark:active:bg-neutral-600 dark:hover:bg-neutral-700 p-1.5 rounded-4xl justify-center border-neutral-50 border dark:border-neutral-900 dark:active:border-neutral-500 transition-all active:border-neutral-300 "
              onClickCapture={() => setMenu(!menu)}
            >
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
            {user && (
              <button
                className="hidden sm:block px-4 py-2 text-white bg-orange-600 rounded-full hover:bg-orange-700 cursor-pointer transition-colors active:bg-orange-800 border border-transparent active:border-orange-600"
                onClick={() => router.push("/create")}
              >
                Create Post
              </button>
            )}

            <div className="flex flex-col items-center">
              <div
                className="flex flex-col items-center cursor-pointer bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 p-1.5 rounded-4xl justify-center transition-all"
                onClick={
                  user
                    ? () => setDialog(!dialog)
                    : loading
                    ? () => {}
                    : gotoAccounts
                }
              >
                {user ? (
                  ProfileImg ? (
                    <Image
                      className="rounded-full"
                      src={ProfileImg}
                      width={30}
                      height={30}
                      alt="Profile"
                    />
                  ) : (
                    <UserIcon
                      width={30}
                      height={30}
                      fill="fill-neutral-500 dark:fill-neutral-400"
                    />
                  )
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
            </div>
            {dialog && (
              <ul
                ref={ref}
                className="bg-white  min-w-40 fixed top-14 right-2 sm:top-16 sm:right-6 dark:bg-neutral-900 shadow-md rounded-xl border-1 border-neutral-300 dark:border-neutral-800"
              >
                <li className="text-sm sm:text-base hover:bg-neutral-300 py-3 px-4 rounded-t-xl transition-colors  dark:hover:bg-neutral-700 cursor-pointer font-semibold">
                  {user?.email}
                </li>
                <li
                  className="text-sm sm:text-base py-3 px-4 hover:bg-neutral-300 transition-colors dark:hover:bg-neutral-700 cursor-pointer font-semibold"
                  onClick={handleUserProfile}
                >
                  My Profile
                </li>

                <li
                  className="text-sm sm:text-base hover:bg-neutral-300 py-3 px-4  transition-colors dark:hover:bg-neutral-700  cursor-pointer font-semibold"
                  onClick={() => router.push("/create")}
                >
                  Create Post
                </li>
                <li
                  className="text-sm sm:text-base hover:bg-neutral-300 py-3 px-4 rounded-b-xl transition-colors dark:hover:bg-neutral-700  cursor-pointer font-semibold"
                  onClick={handleLogOut}
                >
                  LogOut
                </li>
              </ul>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
