import { isObject } from '@zhanghl/utils'
import { ReactiveFlags, reactive } from './reactive'
import { track, trigger } from './effect'

function createGetter(isShadow: boolean) {
  return function get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE)
      return true
    // 收集依赖关系
    track(target, key)

    const getVal = Reflect.get(target, key, receiver)

    // 判断属性值是否是对象
    if (isObject(getVal))
      return isShadow ? getVal : reactive(getVal)

    return getVal
  }
}

function set(target, key, value, receiver) {
  // 修改数据，执行副作用函数
  const res = Reflect.set(target, key, value, receiver)
  // target[key] = value
  trigger(target, key)
  return res
}

function deleteProperty(target, key) {
  const res = Reflect.deleteProperty(target, key)
  trigger(target, key)
  return res
}

export const baseHandlers = {
  get: createGetter(false),
  set,
  deleteProperty,
}

export const shadowReactiveBaseHandlers = {
  get: createGetter(true),
  set,
  deleteProperty,
}

