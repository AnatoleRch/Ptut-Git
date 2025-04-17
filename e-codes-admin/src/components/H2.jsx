import React from "react";
import { twMerge } from "tailwind-merge";

function H2({className, children }) {
  return (
      <h2 className={twMerge("bg-transparent font-semibold text-2xl pl-2 py-2 text-stone-800/80 tracking-tight", className)}>
        {children}
      </h2>
  );
}

export default H2;
