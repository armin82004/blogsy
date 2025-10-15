import Link from "next/link";
import { allPosts } from "../../data/mock-posts";
import { createClient } from "@/app/utils/supabase/client";

export default async function Posts() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const {data:posts,error:postsError} = await supabase
    .from("posts")
    .select("*")
    .order("date", { ascending: false });
  if(postsError){
    return <p className="text-red-500">Failed to load posts.</p>
  }
  return (
    <>
      <div className="container max-w-6xl py-3 px-5 mx-auto flex justify-center flex-col gap-5">
        <h1 className="text-2xl font-bold my-2">All Posts</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {posts.map((post) => {
            return (
              <article
                key={post.id}
                className="p-4 rounded-xl transition-all shadow overflow-hidden hover:shadow-lg dark:bg-neutral-900 hover:scale-105 bg-neutral-200"
              >
                <Link href={`/posts/${post.id}`}>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="rounded-xl w-full h-46 object-cover"
                  />
                </Link>

                <Link href={`/posts/${post.id}`}>
                  <h2 className="sm:text-lg font-semibold hover:text-orange-500 mt-2 line-clamp-2 text-justify tracking-tight">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-sm lg:text-base dark:text-gray-400 text-gray-600 mt-2 line-clamp-5 text-justify tracking-tight">
                  {post.summary}
                </p>
                <span className="text-sm text-gray-400 mt-1 block">
                  {post.date}
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}
