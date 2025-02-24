import {
  getSimulateDeviceInfo,
  removeUserAgent,
  setSimulateDeviceInfo,
  setUserAgent,
} from "./common/toolkit";

const activePreviewList: number[] = [];

const isUnderPreview = (tabId: number) => activePreviewList.includes(tabId);

function setActionIcon(isPreview: boolean) {
  chrome.action.setIcon({
    path: isPreview
      ? "icon-32/simulator-open.png"
      : "icon-32/simulator-close.png",
  });
}
chrome.tabs.onActivated.addListener((activeInfo) => {
  setActionIcon(isUnderPreview(activeInfo.tabId));
});

function updateHeaderRule(tabId: number) {
  if (!tabId) return;

  if (isUnderPreview(tabId)) {
    setUserAgent(tabId);
  } else {
    removeUserAgent();
  }
}

/** inject script to main page */
function injectScript(tab: chrome.tabs.Tab) {
  getSimulateDeviceInfo().then((info) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: ({ url, id }) => {
        // set iframe src through sub_frame's window object
        self.REQUEST_URL = url;
        self.ACTIVE_DEVICE_ID = id;
      },
      args: [{ url: tab.url, id: info.id }],
    });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
    chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ["content.css"],
    });
  });
}

function onReloadPage(tabId: number, info: chrome.tabs.TabChangeInfo) {
  const { status = "" } = info;

  // 预览移动页面的tab刷新时，重新注入脚本
  if (isUnderPreview(tabId) && status === "complete") {
    chrome.tabs.get(tabId).then((tab) => {
      injectScript(tab);
    });
  }
}

/** 监听扩展图标点击事件 */
chrome.action.onClicked.addListener((tab) => {
  const id = tab.id;

  if (isUnderPreview(id)) {
    activePreviewList.splice(activePreviewList.indexOf(id), 1);
    chrome.tabs.onUpdated.removeListener(onReloadPage);
    chrome.tabs.reload();
    setActionIcon(false);
  } else {
    activePreviewList.push(id);
    injectScript(tab);
    chrome.tabs.onUpdated.addListener(onReloadPage);
    setActionIcon(true);
  }

  updateHeaderRule(id);
});

// wait for page's message to inject script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.injectable) {
    console.log("start inject script");

    // cannot use await in following line, will cause error, reference: https://stackoverflow.com/questions/54126343/how-to-fix-unchecked-runtime-lasterror-the-message-port-closed-before-a-respon
    chrome.webNavigation
      .getAllFrames({ tabId: sender.tab.id })
      .then((frames) => {
        const targets = frames.filter(
          (frame) => frame.frameType === "sub_frame"
        );

        console.log("targets", targets);

        chrome.scripting.executeScript(
          {
            target: {
              tabId: sender.tab.id,
              frameIds: targets.map((i) => i.frameId),
            },
            files: ["inner.js"],
          },
          () => {
            // finish inject
            sendResponse({ done: true });
          }
        );

        getSimulateDeviceInfo().then((info) => {
          const { safeArea } = info;
          chrome.scripting.insertCSS(
            {
              target: {
                tabId: sender.tab.id,
                frameIds: targets.map((i) => i.frameId),
              },
              css: `:root { --safe-area-inset-top: ${
                safeArea.top || 44
              }px !important; --safe-area-inset-bottom: ${
                safeArea.bottom || 34
              }px;}`,
            },
            () => {
              // finish inject
              sendResponse({ done: true });
            }
          );
        });

        return true; // required for async sendResponse()
      });
  }

  if (message.cmd === "DEVICE_CHANGE") {
    const { device } = message;
    console.log("change simulate device to:", device);

    setSimulateDeviceInfo(device).then(async () => {
      await chrome.tabs.reload(sender.tab.id);
      sendResponse({ done: true });
    });
  }
  // required for execute sendResponse()
  return true;
});

////////////////////////////////////////////////////////////////////////////////
// 以下逻辑是Service Worker的心跳逻辑，为了保活
self.addEventListener("install", async () => {
  console.log("Service Worker installing...");
  // 在安装时启动心跳
  await startHeartbeat();
});

// 心跳函数定义
let heartbeatInterval: NodeJS.Timeout | null = null;

async function runHeartbeat() {
  await chrome.storage.local.set({ "last-heartbeat": new Date().getTime() });
}

async function startHeartbeat() {
  // 在Service Worker启动时立即运行一次心跳
  await runHeartbeat();
  // 然后每20秒运行一次
  heartbeatInterval = setInterval(runHeartbeat, 20 * 1000);
}

async function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}

// Service Worker 激活事件
self.addEventListener("activate", async () => {
  console.log("Service Worker activating...");
  // 激活时，可能需要清理旧的心跳间隔
  await stopHeartbeat();
  // 然后重新启动心跳
  await startHeartbeat();
});

// Service Worker 消息事件
self.addEventListener("message", async (event) => {
  if (event.data === "stopHeartbeat") {
    console.log("Stopping heartbeat...");
    await stopHeartbeat();
  } else if (event.data === "startHeartbeat") {
    console.log("Starting heartbeat...");
    await startHeartbeat();
  }
});

// Service Worker Fetch 事件
self.addEventListener("fetch", (event) => {
  // 在处理fetch事件时，可以临时启动心跳以保持活跃
  console.log("Handling fetch event...");
  // 这里可以根据需要决定是否启动心跳
});

// 当Service Worker即将被关闭时
self.addEventListener("beforeunload", async () => {
  console.log("Service Worker beforeunload...");
  // 停止心跳
  await stopHeartbeat();
});

// 监听并处理错误，确保Service Worker稳定运行
self.addEventListener("error", (event) => {
  console.error("Service Worker error:", event);
});

// 监听并处理安装失败事件
self.addEventListener("installerror", (event) => {
  console.error("Service Worker install error:", event);
});

// 监听并处理活动失败事件
self.addEventListener("activateerror", (event) => {
  console.error("Service Worker activate error:", event);
});
