import React from "react";
import { twMerge } from "tailwind-merge";

function Button({ onClick, className, children, type}) {
  return (
    <button
    type={type}
      className={twMerge(`shadow-md border-2 border-teal-600/30 hover:bg-slate-50 text-center py-2.5 cursor-pointer transition-all duration-500 rounded-sm flex items-center justify-center m-0 tracking-tight`, className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;