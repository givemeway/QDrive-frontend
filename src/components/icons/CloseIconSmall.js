export const CloseIconSmall = ({ className, style, onClick }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width="16"
      height="16"
      role="presentation"
      focusable="false"
      className={`${className ? className : ""}`}
      {...style}
      onClick={onClick}
    >
      <path
        d="m17.5 6.5-11 11m11 0-11-11"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-miterlimit="10"
        vector-effect="non-scaling-stroke"
      ></path>
    </svg>
  );
};
