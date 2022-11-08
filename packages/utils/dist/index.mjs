function isObject(val) {
  return typeof val === "object";
}
function isOn(key) {
  return key[0] === "o" && key[1] === "n";
}

export { isObject, isOn };
