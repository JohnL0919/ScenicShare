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
  const cls = ` rounded-md font-medium transition-all duration-200 ${
    size === "compact" ? "px-3 py-1 text-sm" : "px-4 py-2"
  } ${
    variant === "primary"
      ? "rounded-md px-4 py-2 text-sm font-medium bg-white/80 text-gray-900 hover:bg-white ring-1 ring-black/5 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
      : "rounded-md px-4 py-2 text-sm font-medium text-white/90 bg-white/5 hover:bg-white/10 ring-1 ring-white/10 backdrop-blur transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
  }
  `;

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
