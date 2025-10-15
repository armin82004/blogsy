/* eslint-disable @next/next/no-img-element */
"use client";

import { createPost } from "@/app/actions";
import { CloseFullScreen, ErrorIcon, UploadIcon } from "@/app/assets/icons";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

type formValues = {
  title: string;
  topic: string;
  summary: string;
  description: string;
  picture: File | null;
};

export default function CreatePost() {
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors,isSubmitting },
  } = useForm<formValues>({
    defaultValues: {
      title: "",
      topic: "",
      summary: "",
      picture: null,
      description: "",
    },
  });

  const onSubmit = (data: formValues) => {
    console.log("Form submitted:", data);
    createPost(data);
    reset();
    removefile();
  };

  function removefile(e?: React.MouseEvent) {
    e?.stopPropagation();
    handleFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleFileChange(file: File | null) {
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const error =
    searchParams.get("SendError") || searchParams.get("uploadError");
  useEffect(() => {
    if (error) {
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
  }, [error, router]);

  return (
    <>
      <Toaster />
      <div className="flex flex-col gap-2">
        <h1 className="text-xl sm:text-2xl font-bold">Create a New Post</h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          Fill out the form below to publish your new content
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 sm:gap-4 mt-4"
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 lg:gap-10">
          <div className="flex flex-col gap-1 w-full sm:w-1/2">
            <label htmlFor="Title" className="text-sm sm:text-base">
              Title
            </label>
            <input
              {...register("title", {
                required: "Title is required!",
                maxLength: { value: 80, message: "Max 80 characters" },
              })}
              id="Title"
              type="text"
              placeholder="Enter your post title here"
              className={`rounded-xs outline border outline-neutral-400 hover:border-orange-500 focus:border-orange-500 focus:outline-orange-500 hover:outline-orange-500 dark:bg-neutral-800 dark:hover:border-neutral-300 dark:hover:outline-neutral-300 dark:focus:border-neutral-300 dark:focus:outline-neutral-300  py-2 px-3 w-full bg-neutral-100 text-sm sm:text-base ${
                errors.title
                  ? "border-red-500 outline-red-500"
                  : "border-neutral-200 dark:border-neutral-800"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.title.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1 w-full sm:w-1/2">
            <label htmlFor="Topic" className="text-sm sm:text-base">
              Topic
            </label>
            <input
              id="Topic"
              type="text"
              placeholder="Enter your post topic here"
              {...register("topic", {
                required: "At least one topic is required!",
                maxLength: { value: 30, message: "Max 30 characters" },
              })}
              className={`rounded-xs outline border   hover:border-orange-500 focus:border-orange-500 focus:outline-orange-500 hover:outline-orange-500 dark:bg-neutral-800 dark:hover:border-neutral-300 dark:hover:outline-neutral-300 dark:focus:border-neutral-300 dark:focus:outline-neutral-300  py-2 px-3 w-full bg-neutral-100 text-sm sm:text-base  ${
                errors.description
                  ? "border-red-500 outline-red-500"
                  : "border-neutral-200 dark:border-neutral-800 outline-neutral-400 dark:outline-neutral-500"
              }`}
            />
            {errors.topic && (
              <p className="text-red-500 text-xs">{errors.topic.message}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="Description" className="text-sm sm:text-base">
            Description
          </label>
          <textarea
            {...register("description", {
              required: "Description is required!",
              maxLength: { value: 10000, message: "Max 10000 characters" },
            })}
            id="Description"
            placeholder="Provide a detailed description of your post"
            className={`rounded-xs outline border outline-neutral-400 hover:border-orange-500 focus:border-orange-500 dark:hover:border-neutral-300 focus:outline-orange-500 hover:outline-orange-500 dark:bg-neutral-800 dark:hover:outline-neutral-300 dark:focus:border-neutral-300 dark:focus:outline-neutral-300  py-2 px-3 resize-none w-full bg-neutral-100 text-sm sm:text-base ${
              errors.description
                ? "border-red-500 outline-red-500"
                : "border-neutral-200 dark:border-neutral-800 outline-neutral-400 dark:outline-neutral-500"
            }`}
            rows={3}
          />
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="Summary" className="text-sm sm:text-base">
            Summary
          </label>
          <textarea
            {...register("summary", {
              required: "Summary is required!",
              maxLength: { value: 400, message: "Max 400 characters" },
            })}
            id="Summary"
            placeholder="Write a brief summary of your post or click 'Generate Summary'"
            className={`rounded-xs outline border outline-neutral-400 hover:border-orange-500 focus:border-orange-500 dark:hover:border-neutral-300 focus:outline-orange-500 hover:outline-orange-500 dark:bg-neutral-800 dark:hover:outline-neutral-300 dark:focus:border-neutral-300 dark:focus:outline-neutral-300  py-2 px-3 resize-none w-full bg-neutral-100 text-sm sm:text-base ${
              errors.summary
                ? "border-red-500 outline-red-500"
                : "border-neutral-200 dark:border-neutral-800 outline-neutral-400 dark:outline-neutral-500"
            }`}
            rows={3}
          />
          {errors.summary && (
            <p className="text-red-500 text-xs">{errors.summary.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm sm:text-base">Post header image</label>
          <Controller
            control={control}
            name="picture"
            render={({ field }) => (
              <div className="w-full border-2 py-6 sm:py-8 dark:border-neutral-700 border-neutral-400 bg-neutral-100 dark:bg-neutral-800 border-dashed flex flex-col items-center justify-center gap-3">
                <input
                  type="file"
                  hidden
                  ref={inputRef}
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    field.onChange(file);
                    handleFileChange(file);
                  }}
                />

                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-32 sm:max-h-40 md:max-h-48 w-auto max-w-full object-contain rounded cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setIsLightboxOpen(true)}
                    />
                    <div className="flex flex-col sm:flex-row gap-2 w-full px-4 sm:w-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          removefile(e);
                          field.onChange(null);
                        }}
                        className="bg-red-500 text-white py-2 px-6 rounded cursor-pointer hover:bg-red-700 transition-colors text-sm sm:text-base font-medium"
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="bg-blue-500 text-white py-2 px-6 rounded cursor-pointer hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
                      >
                        Change Image
                      </button>
                    </div>
                  </>
                ) : (
                  <div
                    onClick={() => inputRef.current?.click()}
                    className="flex flex-col items-center justify-center cursor-pointer py-4"
                  >
                    <UploadIcon
                      fill="fill-neutral-500 dark:fill-neutral-400 sm:w-[45px] sm:h-[45px]"
                      width={40}
                      height={40}
                    />
                    <p className="text-sm sm:text-base text-center px-2">
                      <span>Upload a file</span> or drag and drop
                    </p>
                    <small className="text-xs sm:text-sm">
                      PNG, JPG, GIF up to 10MB
                    </small>
                  </div>
                )}
              </div>
            )}
          />
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto sm:ml-auto text-white bg-orange-500 px-6 py-2.5 mt-2 cursor-pointer rounded-md hover:bg-orange-700 transition-colors text-sm sm:text-base font-medium"
        >
          {isSubmitting ? "Sending..." : "Confirm"}
        </button>
      </form>
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 flex items-center cursor-pointer hover:bg-neutral-800 active:bg-neutral-700 dark:hover:bg-neutral-700 dark:active:bg-neutral-600 p-2 rounded-full justify-center border border-neutral-300 dark:border-neutral-600 transition-all z-10"
            aria-label="Close preview"
          >
            <CloseFullScreen fill="fill-neutral-100 dark:fill-neutral-400" />
          </button>
          <img
            src={preview ?? ""}
            alt="preview"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
