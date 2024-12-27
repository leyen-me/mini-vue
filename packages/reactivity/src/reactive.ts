import { isObject } from "@vue/shared";
import { mutableHandlers, ReactiveFlags } from "./baseHandler";

/**
 * reactive缓存优化
 * 
 * const obj = { a: "1", b: "2" };
 * const obj1 = reactive(obj);
 * const obj2 = reactive(obj);
 * 
 * obj1 === obj2
 * 
 *  WeakMap 的 "Weak" 指的是它持有的是对象键的"弱引用"
 *  当对象只被 WeakMap 引用时，它可以被垃圾回收器回收，这可以防止内存泄漏
 *  只接受对象作为键（不能使用原始值如字符串、数字）
 */
const reactiveMap = new WeakMap();

/**
 * 响应式暴露出去的函数
 */
export const reactive = (target: any) => {
    return createReactiveObject(target);
};

export const shallowReactive = (target: any) => {
    return createReactiveObject(target, true);
};

export const createReactiveObject = (target: any, shallow: boolean = false) => {
    // 只对对象做响应式处理
    // 其他类型的爱谁谁，因为对象可以容纳万物，万物皆对象，如果需要其他类型也有响应式，把其他类型放到对象中即可
    if (!isObject(target)) {
        return target;
    }
    // 如果传进来的是响应式对象，直接返回
    if (target[ReactiveFlags.IS_REACTIVE]) {
        return target;
    }
    if (reactiveMap.has(target)) {
        return reactiveMap.get(target);
    }
    const proxy = new Proxy(target, mutableHandlers);
    reactiveMap.set(target, proxy);
    return proxy;
};


