import { isObject } from '@zhanghl/utils'
import { track, trigger } from './effect'
import { reactive } from './reactive'
// ref的value值，只会访问value这个属性，不需要proxy
// 利用class的getter和setter
export function ref(value) {
  return new RefImpl(value)
}

export function isRef(obj) {
  return obj._isRef
}

class RefImpl {
  // ref 本身也可以是复杂数据类型
  _val: any
  _isRef: boolean

  constructor(value) {
    this._isRef = true
    this._val = isObject(value) ? reactive(value) : value
  }

  get value() {
    track(this, 'value')
    return this._val
  }

  set value(newValue) {
    if (newValue !== this._val) {
      this._val = newValue
      trigger(this, 'value')
    }
  }
}

