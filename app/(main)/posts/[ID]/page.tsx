import { ArrowBack } from "../../../assets/icons";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/app/utils/supabase/server";
import { notFound } from "next/navigation";
import PostToaster from "../../components/PostToaster";
import { removePost } from "@/app/actions";
import DeleteButton from "../../components/deleteButton";
import { allPosts } from "@/app/data/mock-posts";
import AddComent from "../../components/AddComent";

interface Comment {
  id?: string;
  profile: string;
  name: string;
  time: string;
  content: string;
}

export async function generateMetadata({ params }: { params: { ID: string } }) {
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, description, image")
    .eq("id", params.ID)
    .single();

  if (!post) {
    return {
      title: "Post Not Found",
      description: "This post does not exist",
    };
  }

  return {
    title: `Blogsy | ${post.title}`,
    description: post.description.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.description.slice(0, 160),
      url: `https://hqtedfmbeowgqudosubb.supabase.co/storage/v1/object/public/posts/Posts/${params.ID}`,
      images: [post.image],
      type: "article",
    },
  };
}

export default async function Post({ params }: { params: { ID: string } }) {
  const { ID } = await params;
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("*")
    .eq("id", ID)
    .single();

  const { data: authordata } = await supabase
    .from("authors")
    .select("*")
    .eq("id", authData.user?.id)
    .single();

  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", ID);

  const userIds = comments?.map((c) => c.user_id) ?? [];

  const { data: authors } = await supabase
    .from("authors")
    .select("*")
    .in("id", userIds);

  if (postError || !post) {
    notFound();
  }
  const isUser: boolean = authData.user?.id === post.author_id;
  return (
    <>
      <PostToaster />
      <div className="container m-auto max-w-4xl p-3 flex flex-col items-center my-3 gap-2">
        <Link
          href="/"
          className=" transition-colors mb-2 flex items-center mr-auto group"
        >
          <span className="text-inherit hover:text-inherit">
            <ArrowBack
              width={16}
              height={16}
              fill="fill-neutral-500 dark:fill-neutral-400 group-hover:fill-orange-600"
            />
          </span>
          <p className="group-hover:text-orange-600">{`Back to Home`}</p>
        </Link>
        <Image
          width={1000}
          height={200}
          src={post.image}
          alt={post.title}
          className="w-full h-90 object-cover rounded-xl"
        />
        <h1 className="text-2xl  md:text-3xl font-bold my-2 text-center">
          {post.title}
        </h1>
        <div className="flex flex-col justify-center items-center">
          <span className="text-gray-400 mb-2 block text-sm">
            Published on {post.date} • By{" "}
            <Link
              href={isUser ? "/profile" : `/profile/${post.author_id}`}
              className="hover:text-orange-500 text-neutral-500 dark:text-neutral-300 font-semibold hover:underline transition-colors"
            >
              {post.writer}
            </Link>
          </span>
          {isUser && <DeleteButton ID={ID} />}
        </div>
        <p className="text-sm sm:text-base whitespace-pre-line text-justify border-b pb-6 border-b-neutral-300 tracking-tight leading-relaxed dark:border-b-neutral-700">
          {post.description}
        </p>
        <h1 className="text-2xl font-bold my-2 mr-auto">Comments</h1>
        {comments?.map((comment) => {
          const author = authors?.find((a) => a.id === comment.user_id);

          return (
            <div className="flex flex-col gap-2 sm:gap-3 mr-auto" key={comment}>
              <div className="flex gap-2 sm:gap-3 items-start">
                <Image
                  width={50}
                  height={50}
                  src={author.profile_img || "/placeholder.svg"}
                  alt=""
                  className="w-8 h-8 sm:w-12 sm:h-12 md:w-[50px] md:h-[50px] max-w-full rounded-full flex-shrink-0"
                />
                <div className="flex flex-col justify-center min-w-0 flex-1">
                  <div className="flex flex-wrap gap-1 sm:gap-2 items-baseline">
                    <h1 className="text-base sm:text-lg font-bold truncate hover:text-orange-500 transition-colors ">
                      <Link href={`/profile/${author.id}`}>
                        {author.full_name}
                      </Link>
                    </h1>
                    <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm break-words">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        {authData.user?.id && (
          <AddComent params={{ postID: post.id, userID: authData.user.id }} />
        )}
      </div>
    </>
  );
}
