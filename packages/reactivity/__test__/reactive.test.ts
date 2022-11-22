import { describe, expect, it, vi } from 'vitest'
import { effect, isReactive, isRef, reactive, ref, shadowReactive } from '../src'
describe('响应式', () => {
  it('reactive传入普通对象', () => {
    const obj = reactive({ count: 1 })
    let val
    effect(() => {
      val = obj.count
    })
    expect(val).toBe(1)

    obj.count = 2
    expect(val).toBe(2)
  })

  it('reactive传入嵌套对象', () => {
    const obj = reactive({ count: 1, info: { userName: 'zhl' } })
    let val
    effect(() => {
      val = obj.info.userName
    })
    expect(val).toBe('zhl')

    obj.info.userName = 'zhl-coder'
    expect(val).toBe('zhl-coder')
  })

  it('delete属性的响应式', () => {
    const obj = reactive({ name: 'zhl', count: 1 })
    let val
    effect(() => {
      val = obj.name
    })
    expect(val).toBe('zhl')
    delete obj.name
    expect(val).toBeUndefined()
  })

  it('为什么使用reflect', () => {
    const obj = {
      _name: 'zhl',
      set name(newValue) {
        this._name = newValue
      },
      get name() {
        return this._name
      },
    }
    const reObj = reactive(obj)
    const fn1 = vi.fn(() => { })
    effect(() => {
      fn1(reObj.name)
    })
    expect(fn1).toBeCalledTimes(1)

    reObj._name = 'coder'
    expect(fn1).toBeCalledTimes(2)
  })

  it('ref传入简单数据类型', () => {
    const count = ref(1)
    let val
    effect(() => {
      val = count.value
    })

    expect(val).toBe(1)
    count.value++
    expect(val).toBe(2)
  })

  it('ref传入复杂数据类型', () => {
    const obj = ref({ count: 1 })
    let val
    effect(() => {
      val = obj.value.count
    })
    expect(val).toBe(1)

    obj.value.count++
    expect(val).toBe(2)
  })

  it('shadowReactive浅层响应式', () => {
    const obj = shadowReactive({ count: 1, info: { name: 'code' } })
    let val1, val2
    effect(() => {
      val1 = obj.count
      val2 = obj.info.name
    })

    expect(val1).toBe(1)
    expect(val2).toBe('code')

    obj.count = 2
    obj.info.name = 'zhl'

    expect(val1).toBe(2)
    expect(val2).toBe('code')
  })

  it('isRef/isReactive工具函数', () => {
    const num = ref(1)
    const obj = reactive({ count: 1, info: { name: 'zhl' } })
    expect(isRef(num)).toBe(true)
    expect(isReactive(obj)).toBe(true)
  })
})

// 每一个边缘case都需要一个测试
// {}、[] => proxy
// number、string => ref
// Set、Map、WeakMap、WeakSet => proxy
describe('支持set/map', () => {
  it('set', () => {
    const set = reactive(new Set([1]))
    let val
    effect(() => {
      val = set.size
    })
    expect(val).toBe(1)
    set.add(2)
    expect(val).toBe(2)
  })
  it('set的删除', () => {
    const set = reactive(new Set([1, 2]))
    let val
    effect(() => {
      val = set.size
    })
    expect(val).toBe(2)

    set.delete(2)
    expect(val).toBe(1)
  })
  it('set的has', () => {
    const set = reactive(new Set([1, 2]))
    expect(set.has(1)).toBe(true)
    set.delete(1)
    expect(set.has(1)).toBe(false)
  })
})
