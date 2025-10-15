import Image from "next/image";
import Link from "next/link";

export default function Profile(){
  return (
    <div className="container mx-auto flex max-w-6xl flex-col gap-5 px-5 py-3">
      <div className="border border-neutral-700 h-60 rounded-2xl shadow-md flex items-center gap-2">
        <div className="bg-orange-500 rounded-full p-1 mx-4 hover:scale-105 transition-all hover:bg-orange-600">
          <Image
            width={200}
            height={200}
            src="https://avatar.iran.liara.run/public/1"
            alt="Profile Photo"
          ></Image>
        </div>
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold">Alex Barret</h1>
          <h2 className="text-lg font-semibold">32, Software Enginner</h2>
          <p className="text-sm">Joined in 2021</p>
          <button className="bg-orange-500 mr-auto py-2 px-4 my-4 rounded-4xl transition-colors cursor-pointer hover:bg-orange-700">
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3">
        <article
          className="p-4 rounded-xl transition-all shadow overflow-hidden hover:shadow-lg dark:bg-neutral-900 hover:scale-105 bg-neutral-200"
        >
          <Link href="">
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
          <span className="text-sm text-gray-400 mt-1 block">{post.date}</span>
        </article>
      </div>
    </div>
  );
}