import { OPERATE_CMD } from "./common/constant";

// 判断是否在iframe中
if (self !== top) {
  console.log(['running in iframe'])
  addGlobalStyle();
  setStyleTagAnonymous();
  // 需要等标签替换生效后才能替换变量
  setTimeout(() => {
    replaceSafeAreaVariable();
  }, 100);
  initOperationListener();
} else {
  // 不在iframe中，不执行任何逻辑
  console.log("not in iframe");
}

function addGlobalStyle() {
  const style = document.createElement("style");
  const hideScrollBar =
    "::-webkit-scrollbar {background: transparent; width: 0 !important; height: 0 !important;}";
  const customSafeAreaVariable =
    ":root { --safe-area-inset-top: 44px; --safe-area-inset-bottom: 34px;}";

  style.textContent = hideScrollBar + customSafeAreaVariable;

  document.head.prepend(style);
}

function setStyleTagAnonymous() {
  const links = Array.from(document.head.getElementsByTagName("link"));
  console.log("head links", links);

  const cssLinks = links.filter((i) => i.rel.toLowerCase() === "stylesheet");
  const newCssLinks = cssLinks
    ?.map((i) => {
      return `<link rel="stylesheet" type="text/css" href="${i.href}" crossorigin="anonymous">`;
    })
    .join("");
  cssLinks?.map((i) => document.head.removeChild(i));
  document.head.insertAdjacentHTML("beforeend", newCssLinks);
  console.log("css links", cssLinks, document.styleSheets);
}

function appendCustomCSSText(cssText: string) {
  const style = document.createElement("style");
  style.textContent = cssText;
  document.head.append(style);
}

function getSafeAreaSelector() {
  const list = [];

  const sheets = document.styleSheets;
  if (!sheets) {
    return;
  }

  for (let i = 0; i < sheets.length; i++) {
    try {
      const rules = sheets[i].cssRules;
      for (let j = 0; j < rules.length; j++) {
        const target = rules[j] as CSSStyleRule;
        if (/(env\(|constant\()safe-area-inset-/.test(target.cssText)) {
          list.push(target);
        }
      }
    } catch (e) {
      continue;
    }
  }

  return list;
}

function replaceSafeAreaVariable() {
  const selectors = getSafeAreaSelector();

  console.log("selectors", selectors);

  selectors?.map((i) => {
    if (!i?.selectorText) {
      return;
    }
    const cssStr = i.cssText.slice(i.selectorText.length).trim();
    // 获取使用了safe-area-inset-*变量的CSS属性，如下
    // env(safe-area-inset-*)
    // calc(env(safe-area-inset-bottom) + 10%)
    // calc(100vh - 44px - constant(safe-area-inset-top) - 74px - constant(safe-area-inset-bottom))
    const attrs = cssStr.match(
      /[\w\-?]+\:[\w\(\)\+\s\%\-]*(env\(|constant\()safe-area-inset-(top|bottom|left|right)\)[\w\(\)\+\s\%\-\.]*\;/g
    );

    const newCssText = `${i.selectorText} { ${attrs
      ?.map((i) => {
        i = i.trim();
        const keyAndVal = i.split(":");
        if (keyAndVal.length !== 2) {
          return i;
        }
        return (
          keyAndVal[0] +
          ": " +
          keyAndVal[1].replaceAll(
            /(env\(|constant\()safe-area-inset-/g,
            "var(--safe-area-inset-"
          )
        );
      })
      .join("")} }`;
    appendCustomCSSText(newCssText);
  });
}

function initOperationListener() {
  self.addEventListener("message", function (event) {
    console.log("receive message", event);

    const { cmd } = event.data;
    if (cmd === OPERATE_CMD.REFRESH) {
      self.location.reload();
    }
  });
}
