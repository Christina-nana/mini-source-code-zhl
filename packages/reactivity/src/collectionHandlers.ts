import { COL_KEY, ReactiveFlags } from './reactive'
import { track, trigger } from './effect'
const collectionActions = {
  add(key) {
    const target = this[ReactiveFlags.RAW]
    const res = target.add(key)
    trigger(target, COL_KEY)
    return res
  },
  delete(key) {
    const target = this[ReactiveFlags.RAW]
    const res = target.delete(key)
    trigger(target, COL_KEY)
    return res
  },
  has(key) {
    const target = this[ReactiveFlags.RAW]
    const res = target.has(key)
    trigger(target, COL_KEY)
    return res
  },
}
export const collectionHandlers = {
  // 所有的set和map对象触发的方法get函数
  get(target, key) {
    if (key === ReactiveFlags.RAW)
      return target
    if (key === 'size') {
      track(target, COL_KEY)
      return Reflect.get(target, key)
    }
    return collectionActions[key]
  },
}

