import { useState } from "react";

export const CloseButton = ({ handleClose }) => {
  return (
    <>
      <button
        className="float-right underline text-right font-semibold col-span-1 mr-2 text-black"
        onClick={handleClose}
      >
        Close
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg> */}
      </button>
    </>
  );
};
