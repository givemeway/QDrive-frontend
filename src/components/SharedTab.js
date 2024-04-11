const SharedTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-full h-[50px] flex justify-start items-center border-b border-[#DBDBDB]">
      <button
        className={`h-full w-[75px] ${
          activeTab.folders
            ? "text-[#1A1918] border-b border-[#1A1918] font-semibold"
            : "text-[#736C64]"
        }`}
        onClick={() => {
          setActiveTab({ folders: true, files: false, transfer: false });
        }}
      >
        Folders
      </button>
      <button
        className={`h-full w-[75px] ${
          activeTab.files
            ? "text-[#1A1918] border-b border-[#1A1918] font-semibold"
            : "text-[#736C64]"
        } `}
        onClick={() => {
          setActiveTab({ folders: false, files: true, transfer: false });
        }}
      >
        Files
      </button>
      <button
        className={`h-full w-[75px] ${
          activeTab.transfer
            ? "text-[#1A1918] border-b border-[#1A1918] font-semibold"
            : "text-[#736C64]"
        } `}
        onClick={() => {
          setActiveTab({ folders: false, files: false, transfer: true });
        }}
      >
        Transfers
      </button>
    </div>
  );
};

export default SharedTabs;
