/**
 * 存储副作用
 * targetMap={
 *  depMap（target对象）={
 *   属性1:[effect1,effect2],
 *   属性2:[effect1,effect3]
 *  }
 * }
 */
const targetMap = new WeakMap() // WeakMap性能更好，回收机制，弱引用

let activeEffect
const stackEffect: any[] = []
export function track(obj, key) {
  if (!activeEffect)
    return
  let depsMap = targetMap.get(obj)
  if (!depsMap)
    targetMap.set(obj, (depsMap = new Map()))

  let deps = depsMap.get(key)
  if (!deps)
    depsMap.set(key, (deps = new Set()))

  deps.add(activeEffect)
  activeEffect.deps.push(deps)
}

export function trigger(obj, key) {
  const depsMap = targetMap.get(obj)
  if (!depsMap)
    return

  const deps = depsMap.get(key)
  if (deps) {
    const depsToRun = new Set(deps)
    depsToRun.forEach((effect) => {
      effect()
    })
  }
}

function clearup(effectFn) {
  effectFn.deps.forEach((item) => {
    item.delete(effectFn)
  })
  effectFn.deps = []
}

export function effect(fn) {
  const effectFn = () => {
    try {
      activeEffect = effectFn
      stackEffect.push(activeEffect)
      clearup(effectFn)
      fn() // 会触发proxy的get方法，执行track函数，执行完重置activeEffect
    }
    finally {
      // fn内部还有effect，activeEffect指向就错了
      stackEffect.pop()
      // 恢复上一个嵌套数值
      activeEffect = stackEffect[stackEffect.length - 1]
    }
  }
  effectFn.deps = []
  effectFn()
  return effectFn
}

