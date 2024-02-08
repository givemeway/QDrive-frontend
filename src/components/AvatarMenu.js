import { Box, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

export default function AvatarMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  const handleClick = () => {
    setOpenMenu((prev) => !prev);
  };
  return (
    <>
      <button
        id="dropdownUserAvatarButton"
        data-dropdown-toggle="dropdownAvatar"
        className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
        type="button"
      >
        <span className="sr-only">Open user menu</span>
        <img
          className="w-8 h-8 rounded-full"
          src="/docs/images/people/profile-picture-3.jpg"
          alt="user photo"
        />
      </button>

      <div
        id="dropdownAvatar"
        className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
      >
        <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
          <div>Bonnie Green</div>
          <div className="font-medium truncate">name@flowbite.com</div>
        </div>
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownUserAvatarButton"
        >
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Settings
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Earnings
            </a>
          </li>
        </ul>
        <div className="py-2">
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
          >
            Sign out
          </a>
        </div>
      </div>
    </>
    // <div className="relative flex flex-col top-5 right-[-80%]">
    //   <button
    //     className="bg-avatar-icon-color rounded-full w-[30px] h-[30px] absolute left-[170px]"
    //     onClick={handleClick}
    //   >
    //     SK
    //   </button>
    //   {openMenu && (
    //     <div className="w-[200px] h-[400px] z-10 absolute top-9 left-0 right-100 bg-white border border-solid border-dropbox-border-color shadow-sm"></div>
    //   )}
    // </div>
    // <Box
    //   display="Flex"
    //   flexDirection="row"
    //   alignItems="center"
    //   justifyContent="flex-end"
    //   sx={{ margin: 0, padding: 0, height: "34%" }}
    // >
    //   <Button
    //     id="demo-positioned-button"
    //     aria-controls={open ? "demo-positioned-menu" : undefined}
    //     aria-haspopup="true"
    //     aria-expanded={open ? "true" : undefined}
    //     onClick={handleClick}
    //   >
    //     Username
    //   </Button>
    //   <Menu
    //     id="demo-positioned-menu"
    //     aria-labelledby="demo-positioned-button"
    //     anchorEl={anchorEl}
    //     open={open}
    //     onClose={handleClose}
    //     anchorOrigin={{
    //       vertical: "top",
    //       horizontal: "left",
    //     }}
    //     transformOrigin={{
    //       vertical: "top",
    //       horizontal: "left",
    //     }}
    //   >
    //     <MenuItem onClick={handleClose}>Profile</MenuItem>
    //     <MenuItem onClick={handleClose}>My account</MenuItem>
    //     <MenuItem onClick={handleClose}>Logout</MenuItem>
    //   </Menu>
    // </Box>
  );
}
