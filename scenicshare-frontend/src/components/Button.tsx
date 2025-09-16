interface ButtonProps {
  text: string;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

const Button = ({ text, variant = "secondary", onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
        variant === "primary"
          ? "bg-green-500 hover:bg-green-800 text-white"
          : "text-white hover:text-green-700 hover:bg-black/20"
      }`}
    >
      {text}
    </button>
  );
};

export default Button;
