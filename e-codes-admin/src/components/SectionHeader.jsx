import React from "react";
import { twMerge } from "tailwind-merge";

function H2light({className, children }) {
  return (
      <h2 className={twMerge("bg-transparent tracking-tight text-xl sm:text-2xl pl-2 py-2 text-stone-50", className)}>
        {children}
      </h2>
  );
}

export default H2light;
