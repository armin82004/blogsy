"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ErrorIcon } from "../../../assets/icons"; // adjust path
import { useRouter } from "next/navigation";
import { supabase } from "@/app/supabase";

type SignUpFormInputs = {
  email: string;
  password: string;
};

export default function Login() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
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

  const onSubmit: SubmitHandler<SignUpFormInputs> = async ({
    email,
    password,
  }) => {
    setSubmitError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setSubmitError(error.message);
      return;
    }

    router.push("/");
  };

  return (
    <>
      <div className="select-none flex flex-col justify-center items-center h-screen w-screen sm:h-auto sm:max-w-xl md:max-w-2xl bg-gradient-to-b from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-900 rounded-none sm:rounded-2xl shadow-md p-4 sm:p-12 gap-3">
        <img src="/logo.png" className="h-12" />
        <h1 className="font-bold text-4xl">Login to Blogsy</h1>

        {submitError && (
          <div className="flex gap-2 py-3 px-2 max-w-2xl bg-red-600 my-2 text-white rounded-md">
            <span>
              <ErrorIcon width={24} height={24} fill="dark:fill-neutral-100" />
            </span>
            <p>{submitError}</p>
          </div>
        )}

        <form
          className="flex flex-col gap-3 my-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            {...register("email", {
              required: "Please enter a email address.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
            className="rounded-xs outline border border-neutral-200 hover:border-current focus:border-current dark:border-neutral-900 dark:focus:border-neutral-300 dark:focus:outline-neutral-300 dark:outline-neutral-500 dark:hover:outline-neutral-300 py-2 px-3 w-xs"
            type="text"
            placeholder="Email"
          />
          {errors.email?.message && (
            <div className="flex gap-1 text-red-500">
              <span>
                <ErrorIcon width={20} height={20} fill="dark:fill-red-500" />
              </span>
              <p className="text-sm">{errors.email.message}</p>
            </div>
          )}

          <input
            {...register("password", {
              required: "This is required!",
            })}
            className="rounded-xs outline border border-neutral-200 hover:border-current focus:border-current dark:border-neutral-900 dark:focus:border-neutral-300 dark:focus:outline-neutral-300 dark:outline-neutral-500 dark:hover:outline-neutral-300 py-2 px-3 w-xs"
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
            className="p-2 bg-orange-500 cursor-pointer text-white hover:scale-105 hover:bg-amber-700 rounded-3xl transition-all hover:text-white"
            value="Continue"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Continue"}
          </button>
        </form>

        <p className="dark:text-neutral-400 mb-2">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => router.push("/auth/signup")}
            className=" underline dark:text-white underline-offset-2 hover:text-orange-500 cursor-pointer"
          >
            Sign Up for Blogsy
          </span>
        </p>
      </div>
    </>
  );
}
