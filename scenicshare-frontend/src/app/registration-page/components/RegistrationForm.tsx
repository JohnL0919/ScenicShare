import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
};

export default function RegistrationForm() {
  return (
    <main className="max-h-screen text-white flex items-center justify-center px-4 mt-[1rem]">
      <div className="w-full max-w-md  rounded-xl p-6 md:p-7 ">
        <form className="space-y-4">
          {/* Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-sm mb-1">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="John"
                className="w-full rounded-md border-gray-400 border-1 px-3 py-2 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm mb-1">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Doe"
                className="w-full rounded-md border-gray-400 border-1 px-3 py-2 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm mb-1">
              Username
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
                {/* user icon */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" />
                </svg>
              </span>
              <input
                id="username"
                type="text"
                placeholder="adventurer123"
                className="w-full rounded-md border-gray-400 border-1 pl-10 pr-3 py-2 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm mb-1">
              Email
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
                {/* mail icon */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5Z" />
                </svg>
              </span>
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="w-full rounded-md border-gray-400 border-1 pl-10 pr-3 py-2 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm mb-1">
              Password
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
                {/* lock icon */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17 8h-1V6a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-6 0V6a2 2 0 0 1 4 0v2h-4Z" />
                </svg>
              </span>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-md border-gray-400 border-1 pl-10 pr-10 py-2 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                aria-label="toggle password"
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
              >
                {/* eye icon (non-functional) */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 5C5 5 2 12 2 12s3 7 10 7 10-7 10-7-3-7-10-7Zm0 12a5 5 0 1 1 5-5 5 5 0 0 1-5 5Z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 5C5 5 2 12 2 12s3 7 10 7 10-7 10-7-3-7-10-7Zm0 12a5 5 0 1 1 5-5 5 5 0 0 1-5 5Z" />
                </svg>
              </span>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-md border-gray-400 border-1 pl-10 pr-10 py-2 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                aria-label="toggle password"
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 5C5 5 2 12 2 12s3 7 10 7 10-7 10-7-3-7-10-7Zm0 12a5 5 0 1 1 5-5 5 5 0 0 1-5 5Z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 text-sm">
            <input
              id="terms"
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded  border-gray-400 border-1 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-neutral-300">
              I agree to the{" "}
              <a className="text-blue-400 hover:underline" href="#">
                Terms of Service
              </a>{" "}
              and{" "}
              <a className="text-blue-400 hover:underline" href="#">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Button */}
          <button
            type="button"
            className="w-full rounded-md bg-white py-2 font-semibold text-black hover:bg-neutral-200 transition"
          >
            Create Account
          </button>

          {/* Sign in */}
          <p className="text-center text-sm text-neutral-400">
            Already have an account?{" "}
            <a className="text-blue-400 hover:underline" href="/signin">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
