import { Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Search({ searchValue }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchValue);
  const handleChange = (e) => {
    setQuery(e.target.value);
  };
  useEffect(() => {
    setQuery(searchValue);
  }, [searchValue]);
  return (
    <Box
      display="Flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-start"
      columnGap={2}
      sx={{ marginTop: 2, padding: 0 }}
    >
      <TextField
        placeholder="search file/folder"
        variant="outlined"
        size="small"
        sx={{
          marginLeft: 2,
          width: "40%",
        }}
        value={query}
        onChange={handleChange}
      ></TextField>
      <Button
        variant="contained"
        onClick={() => {
          navigate(`/dashboard/search/${query}`);
        }}
      >
        Search
      </Button>
    </Box>
  );
}
