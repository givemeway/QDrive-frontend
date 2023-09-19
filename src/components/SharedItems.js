import { useLocation, useNavigate } from "react-router-dom";
import Header from "./HomePageHeader";
import { useEffect } from "react";

export default function Shared() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const shareID = params.get("k");
  console.log(shareID);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareID]);
  return (
    <>
      <Header />
    </>
  );
}
