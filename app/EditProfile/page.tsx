"use client";

import { ErrorIcon, PhotoLibraryIcon } from "@/app/assets/icons";
import { useForm } from "react-hook-form";
import { getUserProfile, updateUserProfile } from "@/app/actions";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { createClient } from "../utils/supabase/client";
import Router from "next/navigation";
import { redirect } from "next/dist/server/api-utils";

type ProfileInputs = {
  full_name: string;
  bio: string;
  age: number;
  profile_img?: File | null;
};

export default function EditProfile() {
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ProfileInputs>({
    defaultValues: {
      full_name: "",
      bio: "",
      age: undefined,
      profile_img: null,
    },
  });

  useEffect(() => {
    async function test() {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("user:", user);
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .eq("id", user?.id)
        .single();
      console.log("profile data:", data, "error:", error);
    }
    test();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const userData = await getUserProfile();
      console.log(userData);
      reset({
        full_name: userData?.full_name,
        bio: userData?.bio,
        age: userData?.age,
        profile_img: null,
      });
      if (userData?.profile_img) setPreview(userData.profile_img);
    }
    fetchData();
  }, [reset]);

  const onSubmit = async (data: ProfileInputs) => {
    if (data.profile_img && data.profile_img.size > 700 * 1024) {
      toast.error("Profile image is too big! Max 700kb.");
      return;
    }
    setIsSubmitting(true);
    try {
      await updateUserProfile(data);
      toast.success("Profile Updated!");
    } catch (error) {
      console.error(error);
      toast.error("Error Updating Profile!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <Toaster />
      <div className="flex flex-col justify-center items-center min-h-screen w-screen sm:min-h-auto sm:max-w-lg bg-gradient-to-b from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-900 rounded-none sm:rounded-2xl shadow-md p-4 sm:py-7 gap-3">
        <h1 className="text-2xl font-bold">Edit Your Profile</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center gap-2"
          >
            <div
              className={`mx-auto bg-neutral-300 dark:bg-neutral-700 shadow-md rounded-full cursor-pointer ${
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
                  if (file) {
                    if (file.size > 700 * 1024) {
                      toast.error("File is too big! Max 700KB");
                      return;
                    }
                    setPreview(URL.createObjectURL(file));
                    setValue("profile_img", file, { shouldValidate: true });
                  }
                }}
                className="hidden"
              />
            </div>
            Profile Photo
          </label>

          <div className="flex flex-col gap-2">
            <label htmlFor="full_name">Name</label>
            <input
              {...register("full_name", {
                required: "Name is required!",
                pattern: {
                  value: /^[A-Za-z]{2,}\s[A-Za-z]{2,}$/,
                  message: "Enter your first and last name (letters only)",
                },
              })}
              className="rounded-xs outline border outline-neutral-400 border-neutral-200 hover:border-orange-500 focus:border-orange-500 focus:outline-orange-500 dark:border-neutral-800 dark:bg-neutral-800 dark:hover:border-neutral-300 dark:focus:border-neutral-300 dark:focus:outline-neutral-300 dark:outline-neutral-500 dark:hover:outline-neutral-300 py-2 px-3 w-xs"
              type="text"
              placeholder="Enter your full name"
            />
            {errors.full_name?.message && (
              <div className="flex gap-1 text-red-500">
                <span>
                  <ErrorIcon width={20} height={20} fill="dark:fill-red-500" />
                </span>
                <p className="text-sm">{errors.full_name.message}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="bio">Bio</label>
            <textarea
              {...register("bio", {
                maxLength: {
                  value: 200,
                  message: "Bio must be less than 200 characters",
                },
                pattern: {
                  value: /^[\p{L}\p{N}\p{P}\p{S}\p{Zs}]*$/u,
                  message: "Bio contains invalid characters",
                },
              })}
              className="rounded-xs outline border outline-neutral-400 border-neutral-200 hover:border-orange-500 focus:border-orange-500 dark:hover:border-neutral-300 focus:outline-orange-500 hover:outline-orange-500 dark:bg-neutral-800 dark:border-neutral-800 dark:hover:outline-neutral-300 dark:focus:border-neutral-300 dark:focus:outline-neutral-300 dark:outline-neutral-500 py-2 px-3 w-xs resize-none"
              rows={3}
              placeholder="Enter your bio"
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
            <input
              type="number"
              {...register("age", {
                required: "Age is required",
                min: { value: 1, message: "Age must be at least 1" },
                max: { value: 120, message: "Age must be below 120" },
                valueAsNumber: true,
              })}
              className="rounded-xs outline border outline-neutral-400 border-neutral-200 hover:border-orange-500 focus:border-orange-500 dark:border-neutral-800 dark:bg-neutral-800 dark:hover:border-neutral-300 dark:focus:border-neutral-300 dark:focus:outline-neutral-300 dark:outline-neutral-500 py-2 px-3 w-xs appearance-none"
              placeholder="Enter your age"
            />
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
          >
            {isSubmitting ? "..." : "Save Changes"}
          </button>
        </form>
      </div>
    </>
  );
}
