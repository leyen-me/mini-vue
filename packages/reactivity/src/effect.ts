export const effect = (fn: Function, options: any = {}) => {
    // 创建 ReactiveEffect 实例，并设置调度器
    const _effect = new ReactiveEffect(fn, () => {
        _effect.run()
    });

    // 立即执行一次收集依赖
    _effect.run()
    return _effect;
};

// 用于追踪当前正在执行的 effect
export let activeEffect: ReactiveEffect | undefined;

class ReactiveEffect {
    // 记录 effect 执行了多少次
    _trackId: number = 0

    // 记录 effect 依赖的 dep
    deps: any[] = []
    // 记录 dep 的长度
    _depsLength: number = 0

    private _fn: Function;
    private _scheduler: Function;
    public active = true;
    constructor(fn: Function, scheduler: Function) {
        this._fn = fn;
        this._scheduler = scheduler;
    }
    run() {
        if (!this.active) {
            return this._fn();
        }
        let lastEffect = activeEffect;
        try {
            activeEffect = this;
            return this._fn();
        } finally {
            activeEffect = lastEffect;
        }
    }
}

/**
 * 双向收集依赖，建立 dep 和 effect 的映射关系
 * 1. 将 effect 收集到 dep 中
 * 2. 将 dep 收集到 effect 中
 */
export const trackEffect = (effect: ReactiveEffect, dep: any) => {
    dep.set(effect, effect._trackId)
    effect.deps[effect._depsLength++] = dep
}

/**
 * 触发依赖
 */
export const triggerEffect = (dep: any) => {
    for (const effect of dep.keys()) {
        if (effect._scheduler) {
            effect._scheduler()
        }
    }
}
