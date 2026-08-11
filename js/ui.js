export function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

export function makeButton(text, className = "btn", onClick, attributes = {}) {
  const button = element("button", className, text);
  button.type = "button";
  Object.entries(attributes).forEach(([key, value]) => button.setAttribute(key, value));
  if (onClick) button.addEventListener("click", onClick);
  return button;
}

export function clear(node) { while (node.firstChild) node.firstChild.remove(); }

export function formatSentence(parts) {
  const value = parts.join(" ").replace(/\s+([?.!,])/g, "$1");
  return value ? `${value[0].toUpperCase()}${value.slice(1)}${/[?.!]$/.test(value) ? "" : "."}` : "";
}
