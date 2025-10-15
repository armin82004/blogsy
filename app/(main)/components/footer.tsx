import { InstagramIcon, TelegramIcon, XIcon } from "../../assets/icons";

export default function Footer() {
  const now = new Date();
  const currentYear = now.getFullYear();
  return (
    <footer className="w-full border-t border-neutral-300 bg-white px-5 py-6 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="container mx-auto flex flex-col justify-between gap-8 border-b border-neutral-600 pb-5 md:flex-row">
        <div className="order-1 flex max-w-xl flex-col">
          <h2 className="mb-2 text-lg font-semibold sm:text-xl">
            Blogsy: Your daily dose of insights and stories.
          </h2>
          <p className="text-justify text-xs leading-relaxed text-neutral-500 sm:text-sm md:text-base">
            Blogsy is your go-to source for insightful articles, tutorials, and
            inspiration on a wide range of topics. We are passionate about
            sharing knowledge and sparking curiosity.
          </p>
        </div>

        <div className="order-3 flex flex-col items-center md:order-2">
          <h1 className="mb-2 text-lg font-semibold sm:text-xl">Follow Us</h1>
          <div className="flex gap-2">
            <div className="cursor-pointer rounded-full p-2 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700">
              <InstagramIcon fill="fill-neutral-500 dark:fill-neutral-400" />
            </div>
            <div className="cursor-pointer rounded-full p-2 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700">
              <XIcon fill="fill-neutral-500 dark:fill-neutral-400" />
            </div>
            <div className="cursor-pointer rounded-full p-2 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700">
              <TelegramIcon fill="fill-neutral-500 dark:fill-neutral-400" />
            </div>
          </div>
        </div>

        <div className="order-2 flex flex-col md:order-3">
          <h1 className="mb-2 text-lg font-semibold sm:text-xl">Newsletter</h1>
          <p className="mb-3 text-xs text-neutral-500 sm:text-sm md:text-base">
            Subscribe to our newsletter to get the latest updates.
          </p>

          <form className="flex max-w-sm">
            <input
              type="email"
              placeholder="Your email"
              className="flex-grow rounded-l-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-200 sm:text-sm md:text-base"
            />
            <button
              type="submit"
              className="rounded-r-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-orange-600 sm:px-6 sm:text-sm md:text-base"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="flex items-center justify-center pt-5">
        <p className="text-sm text-neutral-400 sm:text-base">
          © {currentYear} Blogsy. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
