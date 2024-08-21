import { IconButton } from "@mui/material";
import BreadCrumb from "./breadCrumbs/Breadcrumb";
import { useEffect, useState } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

const Header = ({ search }) => {
  const [showBreadCrumb, setShowBreadCrumb] = useState(true);
  const queue = useSelector((state) => state.breadCrumbs);
  const navigate = useNavigate();
  useEffect(() => {
    if (search) {
      setShowBreadCrumb(false);
    } else {
      setShowBreadCrumb(true);
    }
  }, [search]);
  return (
    <div className="h-[50px] w-full">
      <BreadCrumb queue={queue} layout={"dashboard"} link={"/dashboard/home"} />
    </div>
  );
};

export default Header;
