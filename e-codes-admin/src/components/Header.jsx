import React from "react";
import { twMerge } from "tailwind-merge";

function Header({ className, children }) {
  return (
    <>
      <h1
        className={twMerge(
          "bg-transparent text-white text-2xl sm:text-4xl border-b-4 border-b-teal-700/40 px-2 py-4 sm:p-8 w-full tracking-tight", className)}
      >
        {children}
      </h1>
    </>
  );
}

export default Header;
