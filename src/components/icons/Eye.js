import "./Eye.css";

export const EyeIcon = ({ style, onClick }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="eye"
      width="24"
      height="24"
      role="presentation"
      focusable="false"
      {...style}
      onClick={onClick}
    >
      <path
        d="M12 9.5A2.321 2.321 0 0 0 9.5 12a2.321 2.321 0 0 0 2.5 2.5 2.321 2.321 0 0 0 2.5-2.5A2.32 2.32 0 0 0 12 9.5Z"
        fill="currentColor"
        vector-effect="non-scaling-stroke"
      ></path>
      <path
        d="M20.177 11.678C20.067 11.446 17.412 6 12 6c-5.411 0-8.066 5.446-8.177 5.678L3.669 12l.154.322C3.933 12.554 6.589 18 12 18c5.412 0 8.067-5.446 8.177-5.678l.154-.322-.154-.322ZM12 16.5c-3.77 0-6.03-3.42-6.65-4.5.62-1.081 2.879-4.5 6.65-4.5 3.771 0 6.029 3.418 6.65 4.5-.621 1.082-2.88 4.5-6.65 4.5Z"
        fill="currentColor"
        vector-effect="non-scaling-stroke"
      ></path>
    </svg>
  );
};
