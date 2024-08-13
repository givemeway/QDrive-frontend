export function Modal({ children, style }) {
  return (
    <div
      className="h-screen w-screen absolute inset-0 z-50 flex items-center justify-center  bg-black bg-opacity-50"
      style={{ ...style }}
    >
      {children}
    </div>
  );
}
