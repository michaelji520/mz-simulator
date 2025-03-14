import React, { useEffect } from "react";
import { OPERATE_CMD } from "../../../common/constant";
import { Button } from "@/components/ui/button";

function Toolbar() {
  const triggerSimulatorChange = (cmd: OPERATE_CMD) => {
    console.log("send message", cmd);
    const iframe = document.getElementById(
      "simulator-inner"
    ) as HTMLIFrameElement;

    iframe.contentWindow.postMessage({ cmd }, "*");
  };

  useEffect(() => {
    const bindRefreshListener = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.key.toLowerCase() === "meta") && e.key === "r") {
        e.preventDefault();
        triggerSimulatorChange(OPERATE_CMD.REFRESH);
      }
    };
    self.addEventListener("keydown", bindRefreshListener);

    return () => {
      self.removeEventListener("keydown", bindRefreshListener);
    };
  }, []);
  return (
    <div className="flex flex-col h-full justify-center">
      <Button onClick={() => triggerSimulatorChange(OPERATE_CMD.REFRESH)}>
        刷新页面
      </Button>
    </div>
  );
}

export default Toolbar;
