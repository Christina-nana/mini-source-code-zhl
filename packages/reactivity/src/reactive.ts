import { track, trigger } from './effect'
import { isObject } from '@zhanghl/utils'

export function reactive(obj: any) {
  return new Proxy(obj, {
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
    }
  })
}
