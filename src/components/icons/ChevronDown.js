export const ChevronDown = ({ style, onClick }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      {...style}
      role="presentation"
      focusable="false"
      onClick={onClick}
    >
      <path
        d="m5.25 9.25 6.5 6.25 6.5-6.25"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-miterlimit="10"
        vector-effect="non-scaling-stroke"
      ></path>
    </svg>
  );
};
