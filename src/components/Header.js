import { Stack, Box, IconButton } from "@mui/material";
import BreadCrumb from "./breadCrumbs/Breadcrumb";
import AvatarMenu from "./AvatarMenu";
import Search from "./SearchFilesFolders";
import { useEffect, useState } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { breadCrumbAtom } from "../Recoil/Store/atoms";
import { useSelector } from "react-redux";

const Header = ({ search }) => {
  const [showBreadCrumb, setShowBreadCrumb] = useState(true);
  // const queue = useRecoilValue(breadCrumbAtom);
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
    <div className="h-full w-full flex flex-row">
      {/* <AvatarMenu /> */}
      {showBreadCrumb ? (
        <div className="grow h-full">
          <BreadCrumb
            queue={queue}
            layout={"dashboard"}
            link={"/dashboard/home"}
          />
        </div>
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
