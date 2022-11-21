import { describe, expect, it } from 'vitest'
import { isObject, isOn } from '../src'
describe('测试工具库', () => {
  it('测试isObject函数', () => {
    expect(isObject({})).toBe(true)
    expect(isObject(123)).toBe(false)
    expect(isObject(null)).toBe(false)
  })
  it('测试isOn函数', () => {
    expect(isOn('on')).toBe(true)
  })
})
