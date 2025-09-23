"use client";
import { useState } from "react";
import Input from "./Input";
import { registerUser } from "@/lib/firebase/Authentication/EmailAuth";

export default function RegistrationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    registerUser(name, email, password, setIsLoading);
    // TODO: send form data
  };

  if (isLoading) {
    return (
      <main className="max-h-screen text-white flex items-center justify-center px-4 mt-[1rem]">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-neutral-300">Creating your account...</p>
        </div>
      </main>
    );
  }

  // only enable submit when everything is filled + terms checked
  const isFormValid =
    name.trim() &&
    email.trim() &&
    userName.trim() &&
    password.trim() &&
    confirm.trim() &&
    password === confirm &&
    acceptTerms;

  return (
    <main className=" text-white flex items-center justify-center px-4  ">
      <div className="w-full max-w-md rounded-xl p-6 md:p-7">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <Input
            label="First Name"
            name="firstName"
            value={name}
            onChange={setName}
            placeholder="Ayrton"
          />

          {/* Username */}
          <Input
            label="Username"
            name="username"
            placeholder="senna123"
            value={userName}
            onChange={setUserName}
          />

          {/* Email */}
          <Input
            label="Email"
            name="email"
            placeholder="ayrtonsenna@f1.com"
            value={email}
            onChange={setEmail}
          />

          {/* Password */}
          <Input
            label="Password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
          />

          {/* Confirm Password */}
          <Input
            label="Confirm Password"
            name="confirmPassword"
            placeholder="••••••••"
            value={confirm}
            onChange={setConfirm}
          />

          {/* Terms */}
          <div className="flex items-start gap-2 text-sm">
            <input
              id="terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border border-gray-400 text-blue-500 focus:ring-blue-500"
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
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full rounded-md bg-white py-2 font-semibold text-black hover:bg-neutral-200 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {isLoading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </main>
  );
}
