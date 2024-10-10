import React from "react";
import Simulator from "./components/simulator";
import Toolbar from "./components/toolbar";

function App() {
  return (
    <div className="flex justify-center items-center w-screen h-screen overflow-hidden">
      <Toolbar />
      <Simulator />
    </div>
  );
}

export default App;
