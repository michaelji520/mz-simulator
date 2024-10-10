import { removeUserAgent, setUserAgent } from "./common/toolkit";

let isUnderPreview = false;
let activeTabId: number = undefined;

function setActionIcon() {
  chrome.action.setIcon({
    path: isUnderPreview
      ? "icon-32/simulator-open.png"
      : "icon-32/simulator-close.png",
  });
}

setActionIcon();
updateHeaderRule();

function updateHeaderRule() {
  if (isUnderPreview) {
    setUserAgent(activeTabId);
  } else {
    removeUserAgent();
  }
}

/** inject script to main page */
function injectScript(tab: chrome.tabs.Tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: ({ url }) => {
      // set iframe src through sub_frame's window object
      self.REQUEST_URL = url;
    },
    args: [{ url: tab.url }],
  });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"],
  });
  chrome.scripting.insertCSS({
    target: { tabId: tab.id },
    files: ["content.css"],
  });
}

function onReloadPage(tabId: number, info: chrome.tabs.TabChangeInfo) {
  const { status = "" } = info;

  // 预览移动页面的tab刷新时，重新注入脚本
  if (tabId === activeTabId && status === "complete") {
    chrome.tabs.get(tabId).then((tab) => {
      injectScript(tab);
    });
  }
}

/** 监听扩展图标点击事件 */
chrome.action.onClicked.addListener((tab) => {
  if (isUnderPreview) {
    isUnderPreview = false;
    activeTabId = undefined;

    chrome.tabs.onUpdated.removeListener(onReloadPage);
    chrome.tabs.reload();
  } else {
    isUnderPreview = true;
    activeTabId = tab.id;

    injectScript(tab);
    chrome.tabs.onUpdated.addListener(onReloadPage);
  }

  setActionIcon();
  updateHeaderRule();
});

// wait for page's message to inject script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.injectable) {
    console.log("start inject script");

    chrome.scripting.executeScript(
      {
        target: { tabId: sender.tab.id, allFrames: true },
        files: ["inner.js"],
      },
      () => {
        // finish inject
        sendResponse({ done: true });
      }
    );
    return true; // required for async sendResponse()
  }
});
