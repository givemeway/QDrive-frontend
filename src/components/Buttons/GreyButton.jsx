import "./GreyButton.css";

export function GreyButton({ text, onClick, style, ref }) {
  return (
    <button
      className={`cancelButton fill-grey `}
      style={{ ...style }}
      onClick={onClick}
      ref={ref}
    >
      {text}
    </button>
  );
}
