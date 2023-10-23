import { SvgIcon } from "@mui/material";

export default function TextIcon({ style }) {
  return (
    <SvgIcon sx={style}>
      <svg
        viewBox="-7 -7 40 40"
        fill="none"
        role="img"
        focusable="false"
        width="40"
        height="40"
        class="dig-ContentIcon brws-file-name-cell-icon dig-ContentIcon--small dig-ContentIcon--overBase"
        data-testid="fallback-file-thumbnail"
      >
        <path
          d="M21.7568 2.5H4.24324C3.19499 2.5 2.38362 2.70706 1.83172 3.11547C1.27982 3.52383 1 4.12424 1 4.9V23.1C1 23.8757 1.27982 24.4761 1.83172 24.8845C2.38355 25.2929 3.19492 25.5 4.24324 25.5H21.7568C22.805 25.5 23.6164 25.2929 24.1683 24.8845C24.7202 24.4762 25 23.8758 25 23.1V4.9C25 4.12429 24.7202 3.52388 24.1683 3.11547C23.6164 2.70706 22.8051 2.5 21.7568 2.5Z"
          fill="var(--dig-color__fileicon__shadow, #bfbfbf)"
        ></path>
        <path
          d="M21.7568 2H4.24324C3.19499 2 2.38362 2.20706 1.83172 2.61547C1.27982 3.02383 1 3.62424 1 4.4V21.6C1 22.3757 1.27982 22.9761 1.83172 23.3845C2.38355 23.7929 3.19492 24 4.24324 24H21.7568C22.805 24 23.6164 23.7929 24.1683 23.3845C24.7202 22.9762 25 22.3758 25 21.6V4.4C25 3.62429 24.7202 3.02388 24.1683 2.61547C23.6164 2.20706 22.8051 2 21.7568 2Z"
          fill="var(--dig-color__fileicon__container, #f7f5f2)"
        ></path>
        <path
          d="M6.333 9.875h13.334v-1.25H6.333v1.25Zm0 2.5h10.834v-1.25H6.333v1.25Zm12.084 2.528H6.333v-1.25h12.084v1.25ZM6.333 17.375h8.75v-1.25h-8.75v1.25Z"
          fill="var(--dig-color__fileicon__icon, #777471)"
        ></path>
        <path
          d="M19.667 8.625v.498H6.333v-.498h13.334Zm-2.5 2.5v.498H6.333v-.498h10.834Zm1.25 2.528v.498H6.333v-.498h12.084Zm-3.333 2.472v.498h-8.75v-.498h8.75Z"
          fill="var(--dig-color__fileicon__icon-shadow, #6c6966)"
        ></path>
      </svg>
    </SvgIcon>
  );
}
