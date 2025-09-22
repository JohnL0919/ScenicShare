import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  text: string | ReactNode;
  variant?: "primary" | "secondary";
  size?: "normal" | "compact";
  onClick?: () => void;
  href?: string;
}

const Button = ({
  text,
  variant = "secondary",
  size = "normal",
  onClick,
  href,
}: ButtonProps) => {
  const cls = `w-full rounded-md font-medium transition-all duration-200 ${
    size === "compact" ? "px-3 py-1 text-sm" : "px-4 py-2"
  } ${
    variant === "primary"
      ? "bg-green-900 hover:bg-green-800 text-white"
      : "text-white hover:text-green-700 hover:bg-black/20"
  }`;

  return href ? (
    <Link href={href} className={`${cls} block text-center`}>
      {text}
    </Link>
  ) : (
    <button onClick={onClick} className={cls}>
      {text}
    </button>
  );
};

export default Button;
