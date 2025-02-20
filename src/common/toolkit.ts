import { deviceConfigList } from "@/app/components/simulator/constants";

export function setUserAgent(tabId: number) {
  const rule: chrome.declarativeNetRequest.UpdateRuleOptions = {
    removeRuleIds: [1, 2],
    addRules: [
      {
        id: 1,
        priority: 1,
        action: {
          type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
          requestHeaders: [
            {
              header: "Sec-Ch-Ua-Mobile",
              operation: chrome.declarativeNetRequest.HeaderOperation.SET,
              value: "?1",
            },
            {
              header: "user-agent",
              operation: chrome.declarativeNetRequest.HeaderOperation.SET,
              value:
                "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
            },
          ],
          responseHeaders: [
            {
              header: "X-Frame-Options",
              operation: chrome.declarativeNetRequest.HeaderOperation.REMOVE,
            },
          ],
        },
        condition: {
          tabIds: [tabId],
          resourceTypes: [chrome.declarativeNetRequest.ResourceType.SUB_FRAME],
        },
      },
      {
        id: 2,
        priority: 1,
        action: {
          type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
          responseHeaders: [
            {
              header: "Access-Control-Allow-Origin",
              operation: chrome.declarativeNetRequest.HeaderOperation.SET,
              value: "*",
            },
          ],
        },
        condition: {
          tabIds: [tabId],
          resourceTypes: [chrome.declarativeNetRequest.ResourceType.STYLESHEET],
        },
      },
    ],
  };
  chrome.declarativeNetRequest.updateSessionRules(rule, async (result: any) => {
    console.log("created userAgent mock rule", result);
  });
}

export function removeUserAgent() {
  chrome.declarativeNetRequest.updateSessionRules(
    {
      removeRuleIds: [1, 2],
    },
    async (result: any) => {
      console.log("cleared mock rules", result);
    }
  );
}

export function setResourceAccessControl() {}

export function getCurrentTab(callback: (tab: chrome.tabs.Tab) => void) {
  let queryOptions = { active: true, lastFocusedWindow: true };
  chrome.tabs.query(queryOptions, ([tab]) => {
    if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    callback(tab);
  });
}

export function setSimulateDeviceInfo(info: any) {
  return chrome.storage.local.set({ SIMULATE_DEVICE_INFO: info });
}

/** 获取选中的设备信息 */
export async function getSimulateDeviceInfo() {
  let target = await chrome.storage.local.get("SIMULATE_DEVICE_INFO");
  if (!target.SIMULATE_DEVICE_INFO) {
    await setSimulateDeviceInfo(deviceConfigList[0]); // 初始化
    target = await chrome.storage.local.get("SIMULATE_DEVICE_INFO");
  }

  console.log(target);
  return target.SIMULATE_DEVICE_INFO;
}
