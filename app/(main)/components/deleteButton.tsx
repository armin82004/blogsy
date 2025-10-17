"use client";
import { removePost } from "@/app/actions";

export default function DeleteButton({ ID }: { ID: string }) {
  return (
    <button
      className="mb-4 block text-sm bg-red-500 px-3 py-1 rounded-full cursor-pointer hover:bg-red-700 transition-colors border border-transparent active:border-red-500"
      onClick={() => removePost(ID)}
    >
      Remove Post
    </button>
  );
}
