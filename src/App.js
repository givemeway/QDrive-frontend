import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/Homepage";
import Login from "./components/Login";
import Register from "./components/Register";
import Panel from "./components/Panel";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Panel />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
