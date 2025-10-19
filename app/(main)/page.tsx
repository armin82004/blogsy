import { Metadata } from "next";
import { allPosts } from "../data/mock-posts";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "../utils/supabase/server";

export const metadata: Metadata = {
  title: "Blogsy | Home",
  description:
    "Blogsy brings you the latest in technology — from AI and software trends to coding tutorials and product innovations.",
};

export default async function Home() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .order("date", { ascending: false });
  if (postsError) {
    return <p className="text-red-500">Failed to load posts.</p>;
  }

  const { count, error: postError } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true });

  if (postError) {
    throw postError;
  }
  const randomOffset = Math.floor(Math.random() * (count ?? 0));
  const { data: randomPost, error } = await supabase
    .from("posts")
    .select("id")
    .range(randomOffset, randomOffset);
  if (error) {
    throw error;
  }
  return (
    <div className="container mx-auto flex max-w-6xl flex-col gap-5 px-5 py-3">
      <section className="flex h-80 flex-col items-center justify-center gap-4 rounded-2xl bg-[url(/images/1.jpg)] px-5 text-white">
        <h1 className="text-2xl font-bold sm:text-4xl text-center">
          Dive into a world of stories
        </h1>
        <p className="max-w-full text-justify text-xs sm:text-sm md:text-base">
          Explore a universe of ideas, perspectives, and narratives. Discover
          stories that resonate with you and share your own voice with the
          world.
        </p>
        <button className="cursor-pointer rounded bg-orange-500 px-3 py-2 text-xs font-semibold transition-all hover:scale-105 hover:bg-orange-600 sm:px-4 sm:text-sm md:text-base">
          <Link href={`/posts/${randomPost[0].id}`}>Start Reading</Link>
        </button>
      </section>

      <section className="flex flex-col gap-3">
        <h1 className="text-xl font-bold sm:text-2xl">Trending Topics</h1>
        <div className="flex flex-wrap gap-2">
          <button className="cursor-pointer rounded-3xl bg-neutral-300 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-orange-500 hover:text-white dark:bg-neutral-900 dark:hover:bg-orange-600 sm:px-4 sm:py-2 sm:text-sm md:text-base">
            Technology
          </button>
          <button className="cursor-pointer rounded-3xl bg-neutral-300 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-orange-500 hover:text-white dark:bg-neutral-900 dark:hover:bg-orange-600 sm:px-4 sm:py-2 sm:text-sm md:text-base">
            Health & Wellness
          </button>
          <button className="cursor-pointer rounded-3xl bg-neutral-300 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-orange-500 hover:text-white dark:bg-neutral-900 dark:hover:bg-orange-600 sm:px-4 sm:py-2 sm:text-sm md:text-base">
            Travel
          </button>
          <button className="cursor-pointer rounded-3xl bg-neutral-300 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-orange-500 hover:text-white dark:bg-neutral-900 dark:hover:bg-orange-600 sm:px-4 sm:py-2 sm:text-sm md:text-base">
            Personal Development
          </button>
          <button className="cursor-pointer rounded-3xl bg-neutral-300 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-orange-500 hover:text-white dark:bg-neutral-900 dark:hover:bg-orange-600 sm:px-4 sm:py-2 sm:text-sm md:text-base">
            Finance
          </button>
          <button className="cursor-pointer rounded-3xl bg-neutral-300 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-orange-500 hover:text-white dark:bg-neutral-900 dark:hover:bg-orange-600 sm:px-4 sm:py-2 sm:text-sm md:text-base">
            Food & Recipes
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h1 className="text-xl font-bold sm:text-2xl">Editor&apos;s Picks</h1>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {posts
            .filter((post) => post.is_editors_pick)
            .map((post) => {
              return (
                <article
                  key={post.id}
                  className="overflow-hidden rounded-xl bg-neutral-200 p-4 shadow transition-all hover:scale-105 hover:shadow-lg dark:bg-neutral-900"
                >
                  <Link href={`/posts/${post.id}`}>
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      width={800}
                      height={600}
                      className="h-auto w-full rounded-xl object-cover"
                      priority={false}
                    />
                  </Link>

                  <Link href={`/posts/${post.id}`}>
                    <h2 className="mt-2 line-clamp-2  font-semibold tracking-tight hover:text-orange-500 sm:text-xl">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="mt-2 line-clamp-5 text-justify text-sm tracking-tight text-gray-600 dark:text-gray-400 lg:text-base">
                    {post.summary}
                  </p>
                  <span className="mt-1 block text-sm text-gray-400">
                    {post.date}
                  </span>
                </article>
              );
            })}
        </div>
      </section>

      <section className="flex max-w-full flex-col items-center justify-center gap-3 p-10">
        <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">
          Discover More
        </h1>
        <p className="text-justify text-sm sm:text-lg">
          Explore a vast library of articles, stories, and insights on a wide
          range of topics.
        </p>
        <button className="cursor-pointer rounded bg-orange-500 px-4 py-2 text-xs font-semibold text-white transition-all hover:scale-105 hover:bg-orange-600 sm:text-sm md:text-base">
          <Link href="/posts">Browse All Content</Link>
        </button>
      </section>
    </div>
  );
}
