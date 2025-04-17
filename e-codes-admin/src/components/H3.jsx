import React from "react";
import { twMerge } from "tailwind-merge";

function H3({ children, className }) {
  return (
      <h3 className={twMerge("bg-transparent text-xl pl-2 text-white tracking-tight", className)}>
        {children}
      </h3>
  );
}

export default H3;
