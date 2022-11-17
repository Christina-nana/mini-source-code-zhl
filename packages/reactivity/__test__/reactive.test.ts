import { describe, expect, it } from 'vitest'
import { effect, reactive, ref } from '../src'
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

  it('reactive支持嵌套', () => {
    let obj = reactive({ count: 1, info: { userName: 'zhl' } })
    let val
    effect(() => {
      val = obj.info.userName
    })
    expect(val).toBe('zhl')

    obj.info.userName = 'zhl-coder'
    expect(val).toBe('zhl-coder')
  })

  it('ref传入简单数据类型', () => {
    let count = ref(1)
    let val
    effect(() => {
      val = count.value
    })

    expect(val).toBe(1)
    count.value++
    expect(val).toBe(2)
  })

  it('ref传入复杂数据类型', () => {
    let obj = ref({ count: 1 })
    let val
    effect(() => {
      val = obj.value.count
    })
    expect(val).toBe(1)

    obj.value.count++
    expect(val).toBe(2)
  })

  // 每一个边缘case都需要一个测试
  it('', () => {

  })
})
