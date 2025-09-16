interface ButtonProps {
  text: string;
}

const Button = ({ text }: ButtonProps) => {
  return (
    <div className="flex flex-row text-white">
      <button>{text}</button>
    </div>
  );
};
export default Button;
