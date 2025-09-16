/**
 * v0 by Vercel.
 * @see https://v0.app/t/hVl5q7YIHfe
 * Documentation: https://v0.app/docs#integrating-generated-code-into-your-nextjs-app
 */
import { SVGProps } from "react";

export default function Component() {
  return (
    <div className="flex items-center w-full max-w-sm space-x-2 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-900 px-3 py-1">
      <SearchIcon className="h-3.5 w-3.5" />
      <input
        type="search"
        placeholder="Search"
        className="w-full border-0 h-6 font-semibold bg-transparent focus:outline-none"
      />
    </div>
  );
}

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
