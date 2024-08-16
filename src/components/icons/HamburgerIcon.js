export const HamburgerIcon = ({ style, onClick }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      {...style}
      role="presentation"
      focusable="false"
      onClick={onClick}
    >
      <path
        d="M18.5 16.5h-13V18h13v-1.5Zm0-5.5h-13v1.5h13V11Zm0-5.5h-13V7h13V5.5Z"
        fill="currentColor"
        vector-effect="non-scaling-stroke"
      ></path>
    </svg>
  );
};
