import iphone11ProGreen from "../device-img/iphone-11-pro-green.png";
import iphone15Black from "../device-img/iphone-15-black.png";
import iphone15ProMax from "../device-img/iphone-15-pro-max.png";

import iphoneSeriesDeviceInfo from "@/external-library/iphone-device-info/src/index";

export const deviceConfigList = [
  {
    id: 1,
    name: "iPhone 11 Pro",
    cover: iphone11ProGreen,
    width: 375,
    height: 812,
    coverAspect: 1385 / 2696,
    coverWidth: 461,
    offsetLeft: 43,
    offsetTop: 42,
    offsetRight: 43,
    offsetBottom: 43,

    safeArea: {
      top: 44,
      left: 0,
      right: 0,
      bottom: 34,
    },
    statusBarConfig: {
      left: 24,
      right: 12,
      fontSize: 14,
      iconHeight: 12,
      height: 44,
    },
  },
  {
    id: 2,
    name: "iPhone 15",
    cover: iphone15Black,
    width: 393,
    height: 852,
    coverAspect: 1319 / 2682,
    coverWidth: 439.5,
    offsetTop: 21,
    offsetLeft: 23,
    offsetRight: 23,
    offsetBottom: 21,
    safeArea: {
      top: 59,
      left: 0,
      right: 0,
      bottom: 34,
    },
    statusBarConfig: {
      left: 40,
      right: 32,
      fontSize: 16,
      iconHeight: 14,
      height: 59,
    },
  },
  {
    id: 3,
    name: "iPhone 15 Pro Max",
    cover: iphone15ProMax,
    width: 430,
    height: 932,
    coverAspect: 4212 / 8688,
    coverWidth: 468,
    offsetTop: 16,
    offsetLeft: 19,
    offsetRight: 23,
    offsetBottom: 21,
    safeArea: {
      top: 59,
      left: 0,
      right: 0,
      bottom: 34,
    },
    statusBarConfig: {
      left: 40,
      right: 32,
      fontSize: 16,
      iconHeight: 14,
      height: 59,
    },
  },
];

console.log("remote list", iphoneSeriesDeviceInfo);
