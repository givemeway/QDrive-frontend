import "./App.css";
import { Route, Routes } from "react-router-dom";
import { enableMapSet } from "immer";
import HomePage from "./components/Homepage";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Shared from "./components/SharedFolder";
import Transfer from "./components/Transfer";
import Signup from "./components/Signup";
enableMapSet();
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
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
