import { activeEffect, trackEffect, triggerEffect } from "./effect"

const targetMap = new WeakMap()

const createDep = (cleanup: any, key: string) => {
    const dep = new Map() as any
    dep.cleanup = cleanup
    dep.key = key
    return dep
}

export const track = (target: any, key: string) => {
    if (!activeEffect) return
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if (!dep) {
        depsMap.set(key, (dep = createDep(() => depsMap.delete(key), key)))
    }
    trackEffect(activeEffect, dep)
}

export const trigger = (target: any, key: string, newValue: any, oldValue: any) => {
    const depsMap = targetMap.get(target)
    if (!depsMap) return
    const dep = depsMap.get(key)
    if (!dep) return
    triggerEffect(dep)
}