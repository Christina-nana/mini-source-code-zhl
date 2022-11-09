import { track, trigger } from './effect'

export function reactive(obj: any) {
  return new Proxy(obj, {
    get(target, key) {
      // 收集依赖关系
      track(target, key)
      return Reflect.get(target, key)
    },
    set(target, key, value, receiver) {
      // 修改数据，执行副作用函数
      const res = Reflect.set(target, key, value, receiver)
      trigger(target, key)
      return res
    },
  })
}
