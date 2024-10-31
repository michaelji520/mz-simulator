import React from "react";
import StatusBar from "./components/status-header";
import iPhoneCover from './iphone-11-pro-green.png';
import HomeIndicator from "./components/home-indicator";

function Simulator() {

  const link = new URL(window.location.href).searchParams.get('link');

  console.log(link);

  const onSubFrameLoad = () => {
    //  tell background it's ready to inject script
    chrome.runtime.sendMessage({injectable: true}, (response) => {
      if(response.done) { /* script injected */ }
      else { /* error handling */ }
    }); 
  }

  return (
    <div className="relative w-[461px] aspect-[1385/2696] p-[43px]">
      <div className="absolute p-[43px] left-0 top-0 w-full h-full bg-contain bg-no-repeat pointer-events-none flex flex-col" style={{backgroundImage: `url(${iPhoneCover})`}}>
        <StatusBar />
        <div className="flex-1"></div>
        <HomeIndicator />
      </div>
      <div className="w-[375px] h-[812px] overflow-hidden shrink-0">
        <iframe onLoad={onSubFrameLoad} id="simulator-inner" className="w-full h-full p-0 m-0 border-none" src={link}></iframe>
      </div>
    </div>
  );
}

export default Simulator;
