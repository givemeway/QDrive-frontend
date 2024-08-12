export const CrossIcon = ({ style, className }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width="24"
      height="24"
      role="presentation"
      focusable="false"
      className={`${className ? className : ""}`}
      {...style}
    >
      <path
        d="M12 4c-5.159 0-8 2.841-8 8s2.841 8 8 8 8-2.841 8-8-2.841-8-8-8Zm3.536 10.475-1.061 1.06L12 13.06l-2.475 2.476-1.06-1.061L10.94 12 8.463 9.525l1.061-1.06L12 10.94l2.475-2.476 1.06 1.061L13.06 12l2.476 2.475Z"
        fill="currentColor"
        vector-effect="non-scaling-stroke"
      ></path>
    </svg>
  );
};
