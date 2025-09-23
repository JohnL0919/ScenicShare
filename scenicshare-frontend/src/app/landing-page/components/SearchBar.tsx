import { SVGProps } from "react";

export default function SearchBar() {
  return (
    <div className=" italic flex items-center w-full max-w-md rounded-full border border-gray-700 bg-black/30 backdrop-blur-sm text-white px-4 py-2 transition-all duration-300 hover:border-green-500/50 focus-within:border-green-400">
      <SearchIcon className="h-4 w-4 text-gray-400" />
      <input
        type="search"
        placeholder="Enter Your Next Destination..."
        className="w-full ml-2 border-0 bg-transparent focus:outline-none text-sm font-medium placeholder:text-gray-500"
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
