import { activeEffect } from "./effect";
import { track, trigger } from "./reactiveEffect";

export enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive",
}

/**
 * 对象代理的意思就是，对对象的属性进行代理，当属性发生变化时，触发相应的回调函数
 */
export const mutableHandlers = {
    get: (target: any, key: string, receiver: any) => {
        // 如果已经是响应式对象了，就直接返回
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true;
        }

        track(target, key)
        /**
         * 
         * 使用 receiver 确保 getter 中的 this 指向代理对象
         * 
         * const original = {
         *      get value() {
         *          return this.name;  // 这里的 this 很重要
         *      },
         *      name: '张三'
         * };
         * 
         * const proxy = reactive(original)
         * console.log(proxy.value)
         */
        return Reflect.get(target, key, receiver);
    },
    set: (target: any, key: string, newValue: any, receiver: any) => {
        let oldValue = target[key]

        // 使用 receiver 确保 setter 中的 this 指向代理对象
        let res = Reflect.set(target, key, newValue, receiver);
        if (oldValue !== newValue) {
            trigger(target, key, newValue, oldValue)
        }
        return res
    },
};