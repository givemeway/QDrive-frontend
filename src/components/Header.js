import { Stack, Box } from "@mui/material";
import BreadCrumb from "./Breadcrumb";
import AvatarMenu from "./AvatarMenu";
import Search from "./SearchFilesFolders";

const Header = () => {
  return (
    <Stack>
      <AvatarMenu />
      <Search />
      <BreadCrumb />
    </Stack>
  );
};

export default Header;
