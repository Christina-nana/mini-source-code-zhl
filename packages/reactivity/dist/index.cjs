'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const utils = require('@zhanghl/utils');

const targetMap = /* @__PURE__ */ new WeakMap();
let activeEffect = null;
const stackEffect = [];
function track(obj, key) {
  if (!activeEffect)
    return;
  let depsMap = targetMap.get(obj);
  if (!depsMap)
    targetMap.set(obj, depsMap = /* @__PURE__ */ new Map());
  let deps = depsMap.get(key);
  if (!deps)
    depsMap.set(key, deps = /* @__PURE__ */ new Set());
  deps.add(activeEffect);
}
function trigger(obj, key) {
  const depsMap = targetMap.get(obj);
  if (!depsMap)
    return;
  const deps = depsMap.get(key);
  if (deps) {
    deps.forEach((effect2) => {
      effect2();
    });
  }
}
function effect(fn) {
  activeEffect = fn;
  stackEffect.push(activeEffect);
  fn();
  stackEffect.pop();
  activeEffect = stackEffect[stackEffect.length - 1];
}

const COL_KEY = Symbol("collection");
const ReactiveFlags = {
  RAW: "__v_raw"
};
const targetTypeMap = (type) => {
  switch (type) {
    case "Object":
    case "Array":
      return 1 /* COMMON */;
    case "Set":
    case "Map":
    case "WeakSet":
    case "WeakMap":
      return 2 /* COLLECTION */;
    default:
      return 0 /* INVALID */;
  }
};
const baseHandlers = {
  get(target, key, receiver) {
    track(target, key);
    return utils.isObject(target[key]) ? reactive(target[key]) : Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver);
    trigger(target, key);
    return res;
  },
  deleteProperty(target, key) {
    const res = Reflect.deleteProperty(target, key);
    trigger(target, key);
    return res;
  }
};
const collectionHandlers = {
  get(target, key) {
    if (key === ReactiveFlags.RAW)
      return target;
    if (key === "size") {
      track(target, COL_KEY);
      return Reflect.get(target, key);
    }
    return collectionActions[key];
  }
};
const collectionActions = {
  add(key) {
    const target = this[ReactiveFlags.RAW];
    const res = target.add(key);
    trigger(target, COL_KEY);
    return res;
  },
  delete(key) {
    const target = this[ReactiveFlags.RAW];
    const res = target.delete(key);
    trigger(target, COL_KEY);
    return res;
  },
  has(key) {
    const target = this[ReactiveFlags.RAW];
    const res = target.has(key);
    trigger(target, COL_KEY);
    return res;
  }
};
function reactive(obj) {
  const handlers = targetTypeMap(utils.toRawType(obj)) === 1 /* COMMON */ ? baseHandlers : collectionHandlers;
  return new Proxy(obj, handlers);
}

function ref(value) {
  return new RefImpl(value);
}
class RefImpl {
  constructor(value) {
    this._val = utils.isObject(value) ? reactive(value) : value;
  }
  get value() {
    track(this, "value");
    return this._val;
  }
  set value(newValue) {
    if (newValue !== this._val) {
      this._val = newValue;
      trigger(this, "value");
    }
  }
}

const res = utils.isObject({});

exports.default = res;
exports.effect = effect;
exports.reactive = reactive;
exports.ref = ref;
