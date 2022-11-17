import { describe, expect, it, vi } from 'vitest'
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

  it('delete属性的响应式', () => {
    let obj = reactive({ name: 'zhl', count: 1 })
    let val
    effect(() => {
      val = obj.name
    })
    expect(val).toBe('zhl')
    delete obj.name
    expect(val).toBeUndefined()
  })

  it('为什么使用reflect', () => {
    let obj = {
      _name: 'zhl',
      set name(newValue) {
        this._name = newValue
      },
      get name() {
        return this._name
      }
    }
    let reObj = reactive(obj)
    let fn1 = vi.fn(() => { })
    effect(() => {
      fn1(reObj.name)
    })
    expect(fn1).toBeCalledTimes(1)

    reObj._name = 'coder'
    expect(fn1).toBeCalledTimes(2)

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
