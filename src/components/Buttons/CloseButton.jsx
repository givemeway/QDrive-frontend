export const CloseButton = ({ handleClose }) => {
  return (
    <>
      <button
        className="float-right underline text-right font-semibold col-span-1 mr-2 text-black"
        onClick={handleClose}
      >
        Close
      </button>
    </>
  );
};
