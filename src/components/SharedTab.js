const Tabs = ({ tabs, setActiveTab }) => {
  return (
    <div className="w-full h-[50px] flex justify-start items-center border-b border-[#DBDBDB]">
      {Object.entries(tabs).map(([tabName, tabActive]) => (
        <button
          className={`h-full w-[75px] text-center ${
            tabActive
              ? "text-[#1A1918] border-b border-[#1A1918] font-semibold"
              : "text-[#736C64]"
          }`}
          onClick={() => {
            const obj = Object.fromEntries(
              Object.entries(tabs).map(([k, v]) => {
                if (tabName === k) return [k, true];
                else return [k, false];
              })
            );
            setActiveTab(obj);
          }}
        >
          {tabName}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
