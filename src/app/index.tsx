import React from "react";
import Simulator from "./components/simulator";
import Toolbar from "./components/toolbar";
import { Card } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deviceConfigList } from "./components/simulator/constants";

function App() {
  const { ACTIVE_DEVICE_ID } = self;
  const onDeviceChange = async (value: string) => {
    const id = Number(value);
    const device = deviceConfigList.find((i) => i.id === id);
    console.log("change simulate device to:", device);

    chrome.runtime.sendMessage({ cmd: "DEVICE_CHANGE", device }, (response) => {
      if (response.done) {
        /* script injected */
      } else {
        /* error handling */
      }
    });
  };
  return (
    <div className="flex justify-center items-center w-screen h-screen overflow-hidden">
      <Toolbar />
      <Simulator />
      <div className="h-full ml-6">
        <Card title="Card Title" className="rounded-xl p-8 mt-8">
          <div className="text-sm font-bold mb-2">选择设备：</div>
          <Select
            onValueChange={onDeviceChange}
            value={ACTIVE_DEVICE_ID.toString()}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择预览设备" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>iOS设备</SelectLabel>
                <SelectItem value="1">iPhone X</SelectItem>
                <SelectItem value="2">iPhone 15</SelectItem>
                <SelectItem value="3">iPhone 15 Pro Max</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Card>
      </div>
    </div>
  );
}

export default App;
