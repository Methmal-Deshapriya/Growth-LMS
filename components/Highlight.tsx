export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={"font-bold  bg-[#9b5bfb]/[0.2] text-[#9b5bfb] px-1 py-0.5"}
    >
      {children}
    </span>
  );
};
