export const UpArrowIcon = ({
  style,
  className,
  onClick,
  onMouseDown,
  onMouseUp,
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${className ? className : ""}`}
      width="16"
      height="16"
      role="presentation"
      focusable="false"
      {...style}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <path
        d="M11.75 19V7m-6.5 5.25L11.75 6l6.5 6.25"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-miterlimit="10"
        vector-effect="non-scaling-stroke"
      ></path>
    </svg>
  );
};
