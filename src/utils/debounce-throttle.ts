/**
 * @title debounce & throttle
 * @description
 * 1. 防抖debounce: 触发间隔小于设定时间将函数挂起不执行，一旦触发间隔大于设定时间将执行函数。
 * 2. 节流throttle: 触发间隔小于设定时间会在每设定时间间隔内只执行一次。
 */

const INIT_MS = 1000;

// 防抖
export const debounce = <T extends any[]>(
    handler: (...params: T) => void,
    ms: number = INIT_MS
) => {
    let timer: any;
    return (...params: T) => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(handler, ms, ...params);
    };
};

// 节流
enum ThrottleMode {
    ignorePost,
    ignorePre,
}

export const throttle = <T extends any[]>(
    handler: (...params: T) => void,
    ms: number = INIT_MS,
    mode: ThrottleMode = ThrottleMode.ignorePost
) => {
    let flag: boolean = true;
    return (...params: T) => {
        if (flag) {
            if (mode == ThrottleMode.ignorePost) {
                handler(...params);
            }
            let timer: any = setTimeout(() => {
                if (mode == ThrottleMode.ignorePre) {
                    handler(...params);
                }
                flag = true;
                clearTimeout(timer);
                timer = null;
            }, ms);
            flag = false;
        }
    };
};
