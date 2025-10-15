"use client";

import { ErrorIcon, PhotoLibraryIcon } from "@/app/assets/icons";
import { useForm } from "react-hook-form";
import { setupProfile } from "../../../../actions";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

type SetupInputs = {
  fullName: string;
  bio: string;
  age: number;
};

export default function SetupProfile() {
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetupInputs>({
    defaultValues: {
      fullName: "",
      bio: "",
      age: undefined,
    },
  });
  const searchParams = useSearchParams();
  const error =
    searchParams.get("insertError") ||
    searchParams.get("userError") ||
    searchParams.get("uploadError");
  useEffect(() => {
    if (error) {
      setIsSubmitting(false);
      toast.custom((t) => (
        <div
          className={`flex gap-2 p-3 sm:p-4 text-sm sm:text-base items-center max-w-2xl bg-red-600 my-2 text-white rounded-full ${
            t.visible && "animate-ease animate-fade-down"
          }`}
        >
          <span>
            <ErrorIcon
              width={30}
              height={30}
              fill="dark:fill-neutral-100 h-6 sm:h-8"
            />
          </span>
          <p>{error}</p>
        </div>
      ));
      router.replace(window.location.pathname);
    }
  }, [searchParams, router, error]);

  const onSubmit = (data: SetupInputs) => {
    if (!profileFile) {
      setFileError(true);
    }
    setIsSubmitting(true);
    setupProfile(data, profileFile);
  };

  return (
    <>
      <Toaster />
      <div className="  flex flex-col justify-center items-center min-h-screen w-screen sm:min-h-auto sm:max-w-lg bg-gradient-to-b from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-900 rounded-none sm:rounded-2xl shadow-md p-4 sm:py-7 gap-3 ">
        <h1 className="text-2xl font-bold">Complete Your Profile</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center gap-2"
          >
            <div
              className={` mx-auto bg-neutral-300 dark:bg-neutral-700 shadow-md rounded-full cursor-pointer ${
                preview ? "p-1" : "p-8"
              }`}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="profile"
                  className="w-35 object-cover h-35 rounded-full"
                />
              ) : (
                <PhotoLibraryIcon
                  fill="fill-neutral-500 dark:fill-neutral-400"
                  width={45}
                  height={45}
                />
              )}
              <input
                type="file"
                accept="image/*"
                id="file-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setProfileFile(file);
                  if (file) setPreview(URL.createObjectURL(file));
                }}
                className="hidden"
              />
            </div>
            Profile Photo
          </label>
          {fileError && (
            <div className="flex gap-1 text-red-500">
              <span>
                <ErrorIcon width={20} height={20} fill="dark:fill-red-500" />
              </span>
              <p className="text-sm">Profile image is required!</p>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Name</label>
            <input
              {...register("fullName", {
                required: "Name is required!",
                pattern: {
                  value: /^[A-Za-z]{2,}\s[A-Za-z]{2,}$/,
                  message: "Enter your first and last name (letters only)",
                },
              })}
              className="rounded-xs outline border outline-neutral-400 border-neutral-200 hover:border-orange-500 focus:border-orange-500 focus:outline-orange-500 hover:outline-orange-500 dark:border-neutral-800  dark:bg-neutral-800 dark:hover:border-neutral-300 dark:focus:border-neutral-300 dark:focus:outline-neutral-300 dark:outline-neutral-500 dark:hover:outline-neutral-300 py-2 px-3 w-xs "
              type="text"
              id="fullName"
              placeholder="Enter your name"
            />
            {errors.fullName?.message && (
              <div className="flex gap-1 text-red-500">
                <span>
                  <ErrorIcon width={20} height={20} fill="dark:fill-red-500" />
                </span>
                <p className="text-sm">{errors.fullName.message}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="bio">Bio</label>
            <textarea
              {...register("bio", {
                maxLength: {
                  value: 200,
                  message: "Bio must be less then 200 characters",
                },
                pattern: {
                  value: /^[a-zA-Z0-9\s.,'"!?()-]*$/,
                  message: "Bio contains invalid characters",
                },
              })}
              className="rounded-xs outline border outline-neutral-400 border-neutral-200 hover:border-orange-500 focus:border-orange-500 dark:hover:border-neutral-300 focus:outline-orange-500 hover:outline-orange-500 dark:bg-neutral-800  dark:border-neutral-800 dark:hover:outline-neutral-300 dark:focus:border-neutral-300 dark:focus:outline-neutral-300 dark:outline-neutral-500  py-2 px-3 w-xs resize-none"
              rows={3}
              id="bio"
              placeholder="Enter your name"
            />
            {errors.bio?.message && (
              <div className="flex gap-1 text-red-500">
                <span>
                  <ErrorIcon width={20} height={20} fill="dark:fill-red-500" />
                </span>
                <p className="text-sm">{errors.bio.message}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="age">Your Age</label>
            <div className="relative">
              <input
                type="number"
                id="age"
                {...register("age", {
                  required: "Age is required",
                  min: { value: 1, message: "Age must be at least 1" },
                  max: { value: 120, message: "Age must be below 120" },
                  valueAsNumber: true,
                })}
                className="rounded-xs outline border outline-neutral-400 border-neutral-200 hover:border-orange-500 focus:border-orange-500 focus:outline-orange-500 hover:outline-orange-500 dark:border-neutral-800  dark:bg-neutral-800 dark:hover:border-neutral-300 dark:focus:border-neutral-300 dark:focus:outline-neutral-300 dark:outline-neutral-500 dark:hover:outline-neutral-300 py-2 px-3 w-xs appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] "
                placeholder="Enter your age"
              />
            </div>
            {errors.age?.message && (
              <div className="flex gap-1 text-red-500">
                <span>
                  <ErrorIcon width={20} height={20} fill="dark:fill-red-500" />
                </span>
                <p className="text-sm">{errors.age.message}</p>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="p-2 mt-2 bg-orange-500 cursor-pointer text-white hover:scale-105 hover:bg-amber-700 rounded-3xl transition-all hover:text-white"
            value="Continue"
          >
            {isSubmitting ? "..." : "Continue"}
          </button>
        </form>
      </div>
    </>
  );
}
