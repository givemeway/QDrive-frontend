export const ContextButton = ({ children, style, onClick }) => {
  return (
    <button
      className="w-full flex flex-row justify-start gap-2 pl-3 my-1 
      items-center  text-sm tracking-wider
      hover:bg-[#F5EFE5]
      hover:overflow-hidden
      "
      onClick={onClick}
      style={{ ...style }}
    >
      {children}
    </button>
  );
};
