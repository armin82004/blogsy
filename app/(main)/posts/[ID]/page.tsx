import { allPosts } from "../../../data/mock-posts";
import { ArrowBack } from "../../../assets/icons";
import Link from "next/link";
import Image from "next/image";

interface Comment {
  id?: string;
  profile: string;
  name: string;
  time: string;
  content: string;
}

export default async function Post({ params }: { params: { ID: string } }) {
  const {ID} = await params;
  if (!ID) throw new Response("Post not found", { status: 404 });
  const post = allPosts.find((p) => p.id === Number(ID));
  if (!post) throw new Response("Post not found", { status: 404 });
  return (
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
      <div className="flex">
        <span className="text-gray-400 mb-4 block text-sm">
          Published on {post.date} • By {post.writer}
        </span>
      </div>
      <p className="text-sm sm:text-base whitespace-pre-line text-justify border-b pb-6 border-b-neutral-300 tracking-tight leading-relaxed dark:border-b-neutral-700">
        {post.description}
      </p>
      <h1 className="text-2xl font-bold my-2 mr-auto">Comments</h1>
      {post.comments.map((comment: Comment, index: number) => {
        return (
          <div className="flex flex-col gap-3 mr-auto" key={index}>
            <div className="flex gap-3 items-start">
              <Image
                width={50}
                height={50}
                src={comment.profile}
                alt=""
                className="w-fit h-10"
              />
              <div className="flex flex-col">
                <div className="flex gap-2 items-baseline">
                  <h1 className="text-lg  font-bold">{comment.name}</h1>
                  <p className="text-xs">{comment.time}</p>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
