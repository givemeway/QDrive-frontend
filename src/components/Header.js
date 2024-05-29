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
    <div className="h-[50px] w-full flex flex-row">
      {showBreadCrumb ? (
        <BreadCrumb
          queue={queue}
          layout={"dashboard"}
          link={"/dashboard/home"}
        />
      ) : (
        <div className="flex flex-row justify-start items-center">
          <IconButton
            aria-label="delete"
            sx={{
              border: "1px solid primary",
              borderRadius: "0px",
              marginLeft: 1.5,
              padding: 0,
            }}
            onClick={() => {
              navigate("/dashboard/home");
            }}
          >
            <KeyboardBackspaceIcon color="light" fontSize="large" />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default Header;
