import { SvgIcon } from "@mui/material";

export default function SpinnerGIF({ style }) {
  return (
    <SvgIcon sx={style}>
      <svg
        class="dig-Spinner--track"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
        data-testid="digSpinnerTrack"
      >
        <rect
          fill="none"
          stroke-linecap="square"
          stroke-width="6"
          x="3"
          y="3"
          width="18"
          height="18"
        ></rect>
      </svg>
    </SvgIcon>
  );
}
