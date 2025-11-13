import React, { ComponentProps } from "react";

import { tv, VariantProps } from "tailwind-variants";

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof button> & {
    loading?: boolean; // Adicionando a propriedade de loading
  };

const button = tv({
  base: "flex items-center justify-center w-full  font-semibold rounded-md px-4 p-4 duration-150",
  variants: {
    variant: {
      default: "bg-primary-500 hover:bg-primary-600 text-white ",
      secondary:
        "bg-white hover:bg-primary-50 text-primary-500 border border-primary-300",
      danger: "bg-red-500 hover:bg-red-700 text-white border border-red-300",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export function ButtonPS({
  children,
  loading,
  variant,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={button({ variant, className })}
      disabled={loading} // Desabilita o botão quando está em loading
    >
      {/* <button
      {...props}
      className={`flex items-center justify-center w-full bg-primary-500 text-white font-semibold rounded-md px-4 p-4 hover:bg-primary-600 duration-150 ${
        loading ? "opacity-70 cursor-not-allowed" : "" // Desabilita o botão quando está em loading
      } ${props.className}`}
      disabled={loading} // Desabilita o botão quando está em loading
    > */}
      {loading && (
        <svg
          className="mr-3 h-5 w-5 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      <span className="font-medium"> {children} </span>
    </button>
  );
}
