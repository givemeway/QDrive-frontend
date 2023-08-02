import { Box, Button, TextField } from "@mui/material";

export default function Search() {
  return (
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
  );
}
