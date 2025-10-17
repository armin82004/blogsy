"use client";

import { useState } from "react";

export default function EditProfile() {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  return (
    <>
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 flex items-center cursor-pointer hover:bg-neutral-800 active:bg-neutral-700 dark:hover:bg-neutral-700 dark:active:bg-neutral-600 p-2 rounded-full justify-center border border-neutral-300 dark:border-neutral-600 transition-all z-10"
            aria-label="Close preview"
          ></button>
        </div>
      )}
    </>
  );
}
