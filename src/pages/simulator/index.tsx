import React from "react";
import ReactDOM from "react-dom/client";
import Simulator from "./components/simulator";
import Toolbar from "./components/toolbar";
import "@/common/global.less"

function App() {
  return (
    <div className="flex justify-center items-center w-screen h-screen overflow-hidden">
      <Toolbar />
      <Simulator />
    </div>
  );
}


ReactDOM.createRoot(document.getElementById("root")).render(<App />);
