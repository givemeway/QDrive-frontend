import { Container, Box } from "@mui/material";
import SignupForm from "./SignupForm";
import { Header } from "./Header.jsx";

export default function Signup() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="w-full">
        <Header />
      </div>
      <div className="w-full h-full flex flex-row justify-center items-center grow">
        <SignupForm />
      </div>
    </div>
  );
}
