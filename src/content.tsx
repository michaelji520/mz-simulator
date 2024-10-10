import React from "react";
import ReactDOM from "react-dom/client";
import "./common/global.less";
import App from "./app";

/** 清除原网页所有样式，保留标题 */
const root = document.documentElement;
document.head.innerHTML = "<title>" + document.title + "</title>";
root.getAttributeNames().map((i) => root.removeAttribute(i));

/** 重新创建body */
document.body = document.createElement("body");
document.body.style.cssText = "overflow: hidden";

ReactDOM.createRoot(document.body).render(<App />);
