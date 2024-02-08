export function Modal({ children }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center h-screen w-screen bg-black bg-opacity-50">
      {children}
    </div>
  );
}
