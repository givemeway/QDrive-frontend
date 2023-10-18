import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/Homepage";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Shared from "./components/SharedFolder";
import Transfer from "./components/Transfer";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sh/:type/:shareId/*" element={<Shared />} />
        <Route path="/sh/t/:shareId/*" element={<Transfer />} />
      </Routes>
    </div>
  );
}

export default App;
