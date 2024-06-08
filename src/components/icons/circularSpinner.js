const CircularSpinner = ({ style }) => {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" {...style}>
      <g>
        <circle
          stroke-dasharray="160.22122533307947 55.40707511102649"
          r="34"
          stroke-width="5"
          stroke="#0061fe"
          fill="none"
          cy="50"
          cx="50"
        >
          <animateTransform
            keyTimes="0;1"
            values="0 50 50;360 50 50"
            dur="0.6802721088435374s"
            repeatCount="indefinite"
            type="rotate"
            attributeName="transform"
          ></animateTransform>
        </circle>
        <g></g>
      </g>
    </svg>
  );
};

export default CircularSpinner;
