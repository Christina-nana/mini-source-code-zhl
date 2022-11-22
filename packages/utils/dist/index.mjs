function isObject(val) {
  return typeof val === "object" && val !== null;
}
function isOn(key) {
  return key[0] === "o" && key[1] === "n";
}
function toRawType(val) {
  return Object.prototype.toString.call(val).slice(8, -1);
}

export { isObject, isOn, toRawType };
