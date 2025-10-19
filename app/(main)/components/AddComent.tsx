"use client";

import { addCommentAction } from "@/app/actions";
import { createClient } from "@/app/utils/supabase/client";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

type commentInput = {
  content: string;
};

export default function AddComent({
  params,
}: {
  params: { postID: string; userID: string };
}) {
  const { postID, userID } = params;

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<commentInput>({
    defaultValues: { content: "" },
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      await addCommentAction(postID, userID, data.content);
      reset();
    });
  });
  return (
    <form onSubmit={onSubmit} className="flex flex-col w-full gap-2 sm:gap-3">
      <textarea
        {...register("content", {
          required: "Comment is required!",
          maxLength: { value: 10000, message: "Max 10000 characters" },
        })}
        id="Description"
        placeholder="Write your comment..."
        className={`rounded-xs outline border outline-neutral-400 hover:border-orange-500 focus:border-orange-500 dark:hover:border-neutral-300 focus:outline-orange-500 hover:outline-orange-500 dark:bg-neutral-800 dark:hover:outline-neutral-300 dark:focus:border-neutral-300 dark:focus:outline-neutral-300 py-2 px-3 resize-none w-full bg-neutral-100 text-sm sm:text-base ${
          errors.content
            ? "border-red-500 outline-red-500"
            : "border-neutral-200 dark:border-neutral-800 outline-neutral-400 dark:outline-neutral-500"
        }`}
        rows={3}
      />
      <button
        type="submit"
        className="mr-auto bg-orange-500 text-white px-3 sm:px-4 rounded-md py-1.5 sm:py-2 text-sm sm:text-base hover:bg-orange-600 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isPending}
      >
        {isPending ? "Sending..." : "Submit Comment"}
      </button>
    </form>
  );
}
