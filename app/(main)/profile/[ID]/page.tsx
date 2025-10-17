import { AddIcon, UserIcon } from "@/app/assets/icons";
import { createClient } from "@/app/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function UserProfile({
  params,
}: {
  params: { ID: string };
}) {
  const supabase = await createClient();
  const ID = params.ID;
  console.log(ID);

  const { data: authData } = await supabase.auth.getUser();

  const { data: user, error: userError } = await supabase
    .from("authors")
    .select("*")
    .eq("id", ID)
    .single();

  const { created_at, full_name, bio, email, profile_img, age } = user;

  const year = created_at ? new Date(created_at).getFullYear() : "Unavailable";

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", user?.id)
    .order("created_at", { ascending: false });
  console.log(profile_img);

  return (
    <>
      {userError && <h1>Error loading user info!</h1>}
      <div className="container mx-auto flex max-w-6xl items-center sm:items-start flex-col gap-5 px-5 my-4">
        <div className="flex flex-col sm:flex-row items-center w-full ">
          <div className="bg-neutral-300 dark:bg-neutral-700 rounded-full p-1 sm:mx-4  transition-all mb-4 sm:mb-0">
            {profile_img ? (
              <Image
                width={200}
                height={200}
                className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 rounded-full"
                src={profile_img}
                alt="Profile Photo"
              />
            ) : (
              <UserIcon
                width={200}
                height={200}
                className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 fill-neutral-800 dark:fill-neutral-300"
              />
            )}
          </div>
          <div className="flex flex-col items-center sm:items-start min-h-full sm:justify-center text-center sm:text-left w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              {full_name}
            </h1>
            <h2 className="text-base sm:text-lg leading-tight mt-1">{bio}</h2>
            <p className="text-xs sm:text-sm mt-1">Joined in {year}</p>
            <button className="bg-orange-500 py-2 px-4 my-2 rounded-full text-white transition-colors cursor-pointer hover:bg-orange-700">
              Send Message
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex max-w-6xl flex-col gap-5 px-5 my-1">
        <div className="border border-neutral-300 dark:border-neutral-700 h-auto rounded-3xl shadow-sm flex flex-col items-center p-4 sm:p-6">
          {!posts || posts.length === 0 ? (
            <div className="flex justify-center w-full min-h-[200px] items-center">
              <div className="group flex items-center gap-2">
                <AddIcon fill="dark:fill-neutral-500 dark:group-hover:fill-neutral-300 transition-all" />
                <h1 className="text-lg sm:text-xl font-bold text-black dark:text-neutral-500 dark:group-hover:text-neutral-300 transition-all cursor-pointer">
                  No Posts Yet
                </h1>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="p-4 rounded-xl transition-all shadow overflow-hidden hover:shadow-lg dark:bg-neutral-900 hover:scale-105 bg-neutral-200"
                >
                  <Link href={`/posts/${post.id}`}>
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="rounded-xl w-full h-48 object-cover"
                    />
                  </Link>

                  <Link href={`/posts/${post.id}`}>
                    <h2 className="text-base sm:text-lg font-semibold hover:text-orange-500 mt-2 line-clamp-2 text-justify tracking-tight">
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
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
