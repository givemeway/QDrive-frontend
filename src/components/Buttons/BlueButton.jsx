import "./BlueButton.css";

export function CustomBlueButton({ text, onClick, style, disabled }) {
  return (
    <>
      {disabled && (
        <button {...style} disabled={disabled}>
          {text}
        </button>
      )}
      {!disabled && (
        <button
          className={`deleteButton fill-blue`}
          style={{ ...style }}
          onClick={onClick}
        >
          {text}
        </button>
      )}
    </>
  );
}
