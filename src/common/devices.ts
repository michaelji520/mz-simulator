interface IDeviceInfo {
  name: string;
  userAgent: string;
  safeAreaInset: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  size: {
    width: number;
    height: number;
  };
  devicePixel: {
    width: number;
    height: number;
  }
}

export const DEVICE_LIST: IDeviceInfo[] = [
  {
    name: 'iPhone X',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
    safeAreaInset: {
      // In Portrait, In Landscape, it would be Top: 0pt, Bottom: 21pt, Left/Right: 44pt
      top: 44,
      bottom: 34,
      left: 0,
      right: 0
    },
    size: {
      width: 375,
      height: 812
    },
    devicePixel: {
      width: 1125,
      height: 2436
    } 
  }
]; 