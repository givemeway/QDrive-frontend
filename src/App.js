import "./App.css";
import { Route, Routes } from "react-router-dom";
import { enableMapSet } from "immer";
import HomePage from "./components/Homepage";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Shared from "./components/SharesItemsPage.js";
import Transfer from "./components/TransferItemsPage.js";
import Signup from "./components/SignupForm.js";

enableMapSet();
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/dashboard/" element={<Dashboard />} />
        <Route path="/sh/:type/:shareId/*" element={<Shared />} />
        <Route path="/sh/t/:shareId/*" element={<Transfer />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
