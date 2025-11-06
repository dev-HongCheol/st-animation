import type { HtmlHTMLAttributes, ReactNode } from "react";

interface Props extends HtmlHTMLAttributes<HTMLButtonElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClass: string;
}

const Button = ({
  containerClass,
  title,
  leftIcon,
  rightIcon,
  ...props
}: Props) => {
  return (
    <button
      {...props}
      className={`group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full bg-violet-50 px-7 py-3 text-black ${containerClass}`}
    >
      {leftIcon && leftIcon}

      <span className="relative inline-flex overflow-hidden font-general text-xs uppercase">
        <div>{title}</div>
      </span>

      {rightIcon && rightIcon}
    </button>
  );
};

export default Button;
