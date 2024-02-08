import "./BlueButton.css";

export function CustomBlueButton({ text, onClick, style }) {
  return (
    <button
      className={`deleteButton fill-blue`}
      style={{ ...style }}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
