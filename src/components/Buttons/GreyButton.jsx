import "./GreyButton.css";

export function GreyButton({ text, onClick, style }) {
  return (
    <button
      className={`cancelButton fill-grey`}
      style={{ ...style }}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
