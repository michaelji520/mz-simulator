import React, { useEffect, useState } from "react";
import StatusBar from "./components/status-header";
import HomeIndicator from "./components/home-indicator";
import { deviceConfigList } from "./constants/index";

function Simulator() {
  const { REQUEST_URL, ACTIVE_DEVICE_ID } = self;
  const currentDevice = deviceConfigList.find(
    (device) => device.id === ACTIVE_DEVICE_ID
  );

  const { width, height, cover, statusBarConfig } = currentDevice;

  const onSubFrameLoad = () => {
    //  tell background it's ready to inject script
    chrome.runtime.sendMessage({ injectable: true }, (response) => {
      if (response.done) {
        /* script injected */
      } else {
        /* error handling */
      }
    });
  };

  return (
    <div
      className="relative"
      style={{
        width: `${currentDevice.coverWidth}px`,
        aspectRatio: `${currentDevice.coverAspect}`,
        paddingTop: `${currentDevice.offsetTop}px`,
        paddingLeft: `${currentDevice.offsetLeft}px`,
      }}
    >
      <div
        className="absolute left-0 top-0 w-full h-full bg-contain bg-no-repeat pointer-events-none flex flex-col"
        style={{
          backgroundImage: `url(${cover})`,
          paddingTop: `${currentDevice.offsetTop}px`,
          paddingLeft: `${currentDevice.offsetLeft}px`,
          paddingRight: `${currentDevice.offsetRight}px`,
          paddingBottom: `${currentDevice.offsetBottom}px`,
        }}
      >
        <StatusBar {...statusBarConfig} />
        <div className="flex-1"></div>
        <HomeIndicator />
      </div>
      <div
        className="overflow-hidden shrink-0"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <iframe
          onLoad={onSubFrameLoad}
          id="simulator-inner"
          className="w-full h-full p-0 m-0 border-none rounded-3xl"
          src={REQUEST_URL}
        ></iframe>
      </div>
    </div>
  );
}

export default Simulator;
