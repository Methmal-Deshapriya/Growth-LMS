"use client";

import { cn } from "@/lib/utils";

const ApplyButton = ({ className }: { className?: string }) => {
  const handleClick = () => {
    const phone = "94723622112";
    const message = "Hello! I want to apply for the program.";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <button
        onClick={handleClick}
        className={cn(
          "px-8 py-4 bg-primary hover:bg-primary/90 cursor-pointer text-white font-semibold rounded-full shadow-lg transition",
          className,
        )}
      >
        Apply for Program
      </button>
    </div>
  );
};

export default ApplyButton;