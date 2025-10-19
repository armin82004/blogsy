import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Blogsy | About Us",
  description:
    "Learn more about Blogsy, our mission, team, and how we bring you the latest in technology, AI, and software trends.",
};

export default function About() {
  return (
    <div className="container max-w-6xl py-3 px-5 mx-auto flex justify-center flex-col gap-5">
      <div className="flex flex-col justify-center py-8 gap-3">
        <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl mx-auto">
          About Blogsy
        </h1>
        <p className="mx-auto text-xs sm:text-sm md:text-base">
          Crafting narratives that inspire and inform.
        </p>
      </div>
      <div className="flex justify-start flex-col gap-5">
        <div className=" flex flex-col gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Our Mission & Vision
          </h2>
          <p className="text-justify text-xs sm:text-sm md:text-base">
            At Blogsy, our mission is to provide a platform for diverse voices
            and perspectives. We envision a world where everyone has access to
            quality information and engaging content that enriches their lives
            and fosters understanding. We are committed to building a community
            where ideas flourish and stories matter.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold">A Brief History</h2>
          <p className="text-justify text-xs sm:text-sm md:text-base">
            Blogsy was founded in 2018 by a group of passionate writers and tech
            enthusiasts who believed in the power of storytelling. Starting as a
            small community blog, it has grown into a leading platform for
            sharing ideas and insights across various topics, connecting
            millions of readers with creators worldwide.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-12 justify-center my-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mx-auto">
          Meet the Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          <div className="flex flex-col justify-center items-center gap-1">
            <Image
              width={200}
              height={200}
              className="h-40 w-fit rounded-full border-3 border-orange-500"
              src="https://avatar.iran.liara.run/public/1"
              alt=""
            />
            <h3 className="text-xl sm:text-2xl font-semibold">Armin Ahmadi</h3>
            <p className="text-orange-500 text-xs sm:text-sm">
              Editor-in-Chief
            </p>
          </div>

          <div className="flex flex-col justify-center items-center gap-1">
            <Image
              width={200}
              height={200}
              className="h-40 w-fit rounded-full border-3 border-orange-500"
              src="https://avatar.iran.liara.run/public/53"
              alt=""
            />
            <h3 className="text-xl sm:text-2xl font-semibold">Shirin Rezaei</h3>
            <p className="text-orange-500 text-xs sm:text-sm">Lead Writer</p>
          </div>

          <div className="flex flex-col justify-center items-center gap-1">
            <Image
              width={200}
              height={200}
              className="h-40 w-fit rounded-full border-3 border-orange-500"
              src="https://avatar.iran.liara.run/public/3"
              alt=""
            />
            <h3 className="text-xl sm:text-2xl font-semibold">Kian Parsa</h3>
            <p className="text-orange-500 text-xs sm:text-sm">
              Community Manager
            </p>
          </div>
        </div>
        <div className="flex justify-center max-w-2xl mx-auto">
          <p className="text-justify text-xs sm:text-sm md:text-base">
            Our team is composed of talented individuals with diverse
            backgrounds and expertise. We are united by our commitment to
            delivering high-quality content and fostering a vibrant community of
            readers and writers.
          </p>
        </div>
      </div>
    </div>
  );
}
