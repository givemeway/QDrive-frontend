export const SearchIcon = ({ style, className, onClick }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width="24"
      height="24"
      role="presentation"
      focusable="false"
      style={{ marginLeft: "-4px", marginRight: "-4px" }}
      className={`${className ? className : ""}`}
      onClick={onClick}
      {...style}
    >
      <path
        d="m19.03 17.97-4.009-4.01A5.89 5.89 0 0 0 16 10.5C16 7.056 13.944 5 10.5 5S5 7.056 5 10.5 7.056 16 10.5 16a5.89 5.89 0 0 0 3.461-.979l4.009 4.01 1.06-1.061ZM6.5 10.5c0-2.617 1.383-4 4-4s4 1.383 4 4-1.383 4-4 4-4-1.383-4-4Z"
        fill="currentColor"
        vector-effect="non-scaling-stroke"
      ></path>
    </svg>
  );
};
