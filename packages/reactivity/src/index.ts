import { isObject } from '@zhanghl/utils'

export { effect } from './effect'
export { reactive } from './reactive'
export { ref } from './ref'

const res = isObject({})
export default res
