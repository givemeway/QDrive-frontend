export const HorizontalLineDividedByText = ({ text }) => {
  return (
    <div className="w-full flex flex-row justify-start items-center">
      <div className=" border-b min-w-[auto] border-[#C9C5BD] grow"></div>
      <span className="text-[#716B6B] w-[auto]">{text}</span>
      <div className=" border-b min-w-[auto] border-[#C9C5BD] grow"></div>
    </div>
  );
};
