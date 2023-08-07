import { Stack, Box } from "@mui/material";
import BreadCrumb from "./Breadcrumb";
import AvatarMenu from "./AvatarMenu";
import Search from "./SearchFilesFolders";

const Header = ({ queue }) => {
  return (
    <Stack>
      <AvatarMenu />
      <Search />
      <BreadCrumb queue={queue} />
    </Stack>
  );
};

export default Header;
