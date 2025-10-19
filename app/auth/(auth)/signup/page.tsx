"use client";

import { useForm } from "react-hook-form";
import { ErrorIcon, GoogleIcon, MailIcon } from "../../../assets/icons"; // adjust path
import { useRouter, useSearchParams } from "next/navigation";
import { signup } from "../../../actions";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { createClient } from "@/app/utils/supabase/client";
import { Metadata } from "next";
type SignUpFormInputs = {
  email: string;
  password: string;
};

export const metadata: Metadata = {
  title: "Blogsy | Sign Up",
  description:
    "Create a Blogsy account to start posting, commenting, and following the latest updates in technology, AI, and software development.",
};

export default function SignUp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const verify = searchParams.get("verify");
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
    if (verify) {
      toast.custom((t) => (
        <div
          className={`flex gap-2 py-4 px-4 max-w-2xl bg-green-600 my-2 text-white rounded-full ${
            t.visible && "animate-ease animate-fade-down"
          }`}
        >
          <span>
            <MailIcon width={24} height={24} fill="dark:fill-neutral-100" />
          </span>
          <p>Verification link sent! Check your email.</p>
        </div>
      ));
      router.replace(window.location.pathname);
    }
  }, [error, router, verify]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleGoogleSignIn() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      console.error("Error signing in:", error.message);
    } else {
      console.log("Redirecting to Google...", data);
    }
    console.log(data);
  }

  return (
    <>
      <Toaster />
      <div className="select-none flex flex-col justify-center items-center h-screen w-screen sm:h-auto sm:max-w-xl md:max-w-2xl bg-gradient-to-b from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-900 rounded-none sm:rounded-2xl shadow-md p-4 sm:p-12 gap-3">
        <Image
          width={70}
          height={70}
          alt="Site Logo"
          src="/logo.png"
          className="h-12 w-12"
        />
        <h1 className="font-bold text-4xl">Sign Up to Blogsy</h1>

        <form
          className="flex flex-col gap-3 my-2"
          onSubmit={handleSubmit(signup)}
        >
          <input
            {...register("email", {
              required: "Please enter a email address.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
            className="rounded-xs outline border outline-neutral-400 border-neutral-200 hover:border-orange-500 focus:border-orange-500 focus:outline-orange-500 hover:outline-orange-500 dark:bg-neutral-800  dark:border-neutral-800 dark:hover:border-neutral-300 dark:focus:border-neutral-300 dark:focus:outline-neutral-300 dark:outline-neutral-500 dark:hover:outline-neutral-300 py-2 px-3 w-xs"
            type="text"
            placeholder="Email"
          />
          {errors.email?.message && (
            <div className="flex gap-1 text-red-500">
              <span>
                <ErrorIcon width={20} height={20} fill="dark:fill-red-500" />
              </span>
              <p className="text-sm">{errors.email?.message}</p>
            </div>
          )}

          <input
            {...register("password", {
              required: "This is required!",
            })}
            className="rounded-xs outline border outline-neutral-400 border-neutral-200 hover:border-orange-500 focus:border-orange-500 focus:outline-orange-500 hover:outline-orange-500 dark:bg-neutral-800  dark:border-neutral-800 dark:hover:border-neutral-300 dark:focus:border-neutral-300 dark:focus:outline-neutral-300 dark:outline-neutral-500 dark:hover:outline-neutral-300 py-2 px-3 w-xs"
            type="password"
            placeholder="Password"
          />
          {errors.password?.message && (
            <div className="flex gap-1 text-red-500">
              <span>
                <ErrorIcon width={20} height={20} fill="dark:fill-red-500" />
              </span>
              <p className="text-sm">Please enter your password.</p>
            </div>
          )}

          <button
            type="submit"
            className="p-2 bg-orange-500 cursor-pointer text-white hover:scale-105 hover:bg-amber-700 rounded-3xl transition-all hover:text-white "
            value="Continue"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing up..." : "Continue"}
          </button>

          <button
            type="button"
            className="flex justify-center p-2 dark:bg-neutral-800 cursor-pointer dark:text-white hover:scale-105 border border-transparent dark:active:border-neutral-700 dark:active:bg-neutral-800 w- rounded-full transition-all dark:hover:text-white bg-neutral-300 active:border-neutral-400 "
            value="Continue"
            onClick={handleGoogleSignIn}
          >
            <GoogleIcon className="mr-2" />
            Sign up with Google
          </button>
        </form>

        <p className="dark:text-neutral-400 mb-2">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/auth/login")}
            className=" underline dark:text-white underline-offset-2 hover:text-orange-500 cursor-pointer"
          >
            Login for Blogsy
          </span>
        </p>
      </div>
    </>
  );
}
