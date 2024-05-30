export const Snackbar = ({ open, children, style }) => {
  return (
    <>
      {open && (
        <div
          className="grid grid-cols-8 absolute 
            bottom-5 left-[50%] transform translate-x-[-50%]
           bg-dropbox-cancel w-full md:w-[450px] h-[50px] z-[10000] text-white shadow-sm
            shadow-gray-500 "
          style={{ ...style }}
        >
          {children}
        </div>
      )}
    </>
  );
};
