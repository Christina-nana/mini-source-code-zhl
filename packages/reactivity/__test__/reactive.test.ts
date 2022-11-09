import { describe, expect, it } from 'vitest'
import { effect, reactive } from '../src'
describe('响应式', () => {
  it('reactive基本功能', () => {
    const obj = reactive({ count: 1 })
    let val
    effect(() => {
      val = obj.count
    })
    expect(val).toBe(1)

    obj.count = 2
    expect(val).toBe(2)
  })
})
