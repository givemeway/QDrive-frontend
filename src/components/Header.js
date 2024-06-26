import { Stack, Box, IconButton } from "@mui/material";
import BreadCrumb from "./breadCrumbs/Breadcrumb";
import AvatarMenu from "./AvatarMenu";
import Search from "./SearchFilesFolders";
import { useEffect, useState } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { breadCrumbAtom } from "../Recoil/Store/atoms";

const Header = ({ search }) => {
  const [showBreadCrumb, setShowBreadCrumb] = useState(true);
  const queue = useRecoilValue(breadCrumbAtom);
  const navigate = useNavigate();
  useEffect(() => {
    if (search) {
      setShowBreadCrumb(false);
    } else {
      setShowBreadCrumb(true);
    }
  }, [search]);
  return (
    <Stack sx={{ height: "100%" }}>
      {/* <AvatarMenu /> */}
      {showBreadCrumb ? (
        <BreadCrumb
          queue={queue}
          layout={"dashboard"}
          link={"/dashboard/home"}
        />
      ) : (
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
          sx={{ margin: 0, padding: 0, height: "33%" }}
        >
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
        </Box>
      )}
    </Stack>
  );
};

export default Header;
