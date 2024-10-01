export const ShareBanner = ({ owner, name, item }) => {
  return (
    <div className="bg-[#DEEBFF] w-full flex flex-row justify-center items-center p-2 h-[100px]">
      <p className="text-left w-full font-sans ">
        You’ve received{" "}
        <span className="font-semibold capitalize">{owner}'s</span> {item}{" "}
        <span className="font-semibold capitalize">{name}. </span>
        Join them on Dropbox for secure, reliable file storage that you can
        trust.
      </p>
    </div>
  );
};
