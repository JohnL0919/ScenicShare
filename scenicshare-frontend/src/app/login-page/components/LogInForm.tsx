"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "../../registration-page/components/Input";
import { loginUserWithEmailAndPassword } from "@/lib/firebase/Authentication/EmailAuth";
import { useAuth } from "@/contexts/authContexts";

export default function LogInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { userLoggedIn } = useAuth();

  // Use useEffect for navigation instead of doing it during render
  useEffect(() => {
    if (userLoggedIn) {
      router.push("/protected/home-page");
    }
  }, [userLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await loginUserWithEmailAndPassword(email, password);
      // Navigation will happen automatically through auth state change
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render the form if the user is already logged in
  if (userLoggedIn) {
    return <div className="text-center mt-10">Redirecting to home page...</div>;
  }

  if (isLoading) {
    return (
      <main className="text-white flex items-center justify-center px-4">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-neutral-300">Signing in...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl p-6 md:p-7">
        <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
          {/* Email */}
          <Input
            label="Email"
            name="email"
            placeholder="ayrtonsenna@f1.com"
            value={email}
            type="email"
            onChange={setEmail}
          />

          {/* Password */}
          <Input
            label="Password"
            name="password"
            placeholder="••••••••"
            value={password}
            type="password"
            onChange={setPassword}
          />

          {/* Button */}
          <button
            type="submit"
            disabled={!email.trim() || !password.trim() || isLoading}
            className="w-full rounded-md bg-white py-2 font-semibold text-black hover:bg-neutral-200 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-neutral-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/registration-page"
              className="text-blue-400 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
