import { Container, Box } from "@mui/material";
import SignupForm from "./SignupForm";

export default function Signup() {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SignupForm />
    </Box>
  );
}
