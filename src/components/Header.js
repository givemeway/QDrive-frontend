import { Stack, Box, IconButton } from "@mui/material";
import BreadCrumb from "./Breadcrumb";
import AvatarMenu from "./AvatarMenu";
import Search from "./SearchFilesFolders";
import { useEffect, useState } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import { useNavigate } from "react-router-dom";

const Header = ({ queue, searchValue, search }) => {
  const [showBreadCrumb, setShowBreadCrumb] = useState(true);
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
      <AvatarMenu />
      <Search searchValue={searchValue} />
      {showBreadCrumb ? (
        <BreadCrumb queue={queue} layout={"dashboard"} />
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
