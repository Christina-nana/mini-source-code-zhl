import { isObject } from '@zhanghl/utils'

export { effect } from './effect'
export { reactive, shadowReactive, isReactive } from './reactive'
export { ref, isRef } from './ref'

const res = isObject({})
export default res
