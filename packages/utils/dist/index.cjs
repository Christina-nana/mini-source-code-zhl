'use strict';

function isObject(val) {
  return typeof val === "object" && val !== null;
}
function isOn(key) {
  return key[0] === "o" && key[1] === "n";
}
function toRawType(val) {
  return Object.prototype.toString.call(val).slice(8, -1);
}

exports.isObject = isObject;
exports.isOn = isOn;
exports.toRawType = toRawType;
