import { isObject } from '@zhanghl/utils'
import { track, trigger } from './effect'

function getRawType(val: any) {
  return Object.prototype.toString.call(val).slice(8, -1)
}

const enum TargetType {
  INVALID = 0,
  COMMON = 1, // 普通对象
  COLLECTION = 2, // Set、Map、WeakSet、WeakMap
}

const targetTypeMap = (type) => {
  switch (type) {
    case 'Object':
    case 'Array':
      return TargetType.COMMON
    case 'Set':
    case 'Map':
    case 'WeakSet':
    case 'WeakMap':
      return TargetType.COLLECTION
    default:
      return TargetType.INVALID
  }
}

const baseHandlers = {
  get(target, key, receiver) {
    track(target, key)
    // 收集依赖关系
    return isObject(target[key]) ? reactive(target[key]) : Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    // 修改数据，执行副作用函数
    const res = Reflect.set(target, key, value, receiver)
    // target[key] = value
    trigger(target, key)
    return res
  },
  deleteProperty(target, key) {
    const res = Reflect.deleteProperty(target, key)
    trigger(target, key)
    return res
  },
}

const COL_KEY = Symbol('collection')
const collectionHandlers = {
  // set.add、set.delete、set.has...都是触发get函数
  get(target, key) {
    if (key === '__reative_raw')
      return target

    if (key === 'size') {
      track(target, COL_KEY)
      return Reflect.get(target, key)
    }
    return collectionActions[key]
  },
}

const collectionActions = {
  add(key) {
    const target = this.__reative_raw
    const res = target.add(key)
    trigger(target, COL_KEY)
    return res
  },
  delete() {

  },
  has() {

  },
}

export function reactive(obj: any) {
  const handlers = targetTypeMap(getRawType(obj)) === TargetType.COMMON ? baseHandlers : collectionHandlers
  return new Proxy(obj, handlers)
}
