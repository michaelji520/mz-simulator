import React from "react";
import Cellular from "./cellular.svg";
import Wifi from "./wifi.svg";
import Battery from "./battery.svg";

function StatusBar() {
  return (
    <div className="flex justify-between items-center text-black w-full py-0 pl-6 pr-3 bg-transparent" style={{height: 'var(--safe-area-inset-top)'}}>
      <div className="text-sm font-medium">18:02</div>
      <div className="flex">
        <img className="mr-1" src={Cellular} />
        <img className="mr-1" src={Wifi} />
        <img src={Battery} />
      </div>
    </div>
  );
}

export default StatusBar;
