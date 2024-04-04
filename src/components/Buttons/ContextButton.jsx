export const ContextButton = ({ children, style, onClick, ref }) => {
  return (
    <button
      className="w-full flex flex-row justify-start  pl-3  
      items-center  text-sm tracking-wider
      gap-1 h-[40px]
      hover:bg-[#F5EFE5]
      hover:overflow-hidden
      "
      onClick={onClick}
      style={{ ...style }}
      ref={ref}
    >
      {children}
    </button>
  );
};
