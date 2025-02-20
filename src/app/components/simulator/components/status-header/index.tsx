import React from "react";
import Cellular from "./cellular.svg";
import Wifi from "./wifi.svg";
import Battery from "./battery.svg";

interface IStatusBar {
  left: number;
  right: number;
  fontSize?: number;
  iconHeight?: number;
  height: number;
}

function StatusBar(props: IStatusBar) {
  const { left, right, fontSize = 14, iconHeight, height } = props;
  return (
    <div
      className="flex justify-between items-center text-black w-full py-0 bg-transparent"
      style={{
        height: height,
        paddingLeft: `${left}px`,
        paddingRight: `${right}px`,
      }}
    >
      <div className="font-bold" style={{ fontSize }}>
        18:02
      </div>
      <div className="flex">
        <img
          className="mr-[6px]"
          style={{ height: iconHeight }}
          src={Cellular}
        />
        <img className="mr-[6px]" style={{ height: iconHeight }} src={Wifi} />
        <img style={{ height: iconHeight }} src={Battery} />
      </div>
    </div>
  );
}

export default StatusBar;
