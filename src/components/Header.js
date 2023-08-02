import { useState } from "react";
import { Button, TextField, Menu, MenuItem, Stack, Box } from "@mui/material";
import BreadCrumb from "./Breadcrumb";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Stack>
      <Box
        display="Flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-end"
        sx={{ marginBottom: 2 }}
      >
        <Button
          id="demo-positioned-button"
          aria-controls={open ? "demo-positioned-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          Username
        </Button>
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
      </Box>
      <Box
        display="Flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start"
        columnGap={2}
        sx={{ marginBottom: 2 }}
      >
        <TextField
          placeholder="search file/folder"
          variant="outlined"
          size="small"
          sx={{ marginLeft: 2, width: "40%" }}
        ></TextField>
        <Button variant="contained">Search</Button>
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <BreadCrumb />
      </Box>
    </Stack>
  );
};

export default Header;
