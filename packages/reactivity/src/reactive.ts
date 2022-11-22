import { toRawType } from '@zhanghl/utils'
import { baseHandlers, shadowReactiveBaseHandlers } from './baseHandlers'
import { collectionHandlers } from './collectionHandlers'

export const COL_KEY = Symbol('collection')
export const enum TargetType {
  INVALID = 0,
  COMMON = 1, // 普通对象
  COLLECTION = 2, // Set、Map、WeakSet、WeakMap
}
export const ReactiveFlags = {
  RAW: '__v_raw',
  IS_REACTIVE: '__is_reactive',
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

export function isReactive(obj) {
  return obj[ReactiveFlags.IS_REACTIVE]
}

export function reactive(obj: any) {
  const handlers = targetTypeMap(toRawType(obj)) === TargetType.COMMON ? baseHandlers : collectionHandlers
  return new Proxy(obj, handlers)
}

export function shadowReactive(obj: any) {
  const handlers = targetTypeMap(toRawType(obj)) === TargetType.COMMON ? shadowReactiveBaseHandlers : collectionHandlers
  return new Proxy(obj, handlers)
}
