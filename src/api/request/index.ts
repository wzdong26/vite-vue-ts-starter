import axios, { AxiosRequestConfig } from 'axios';
import fLoginInvalidCbk from './fLoginInvalidCbk';
import fTimeoutCbk, {
    REQUEST_TIMEOUT,
    REQUEST_TIMEOUT_MESSAGE,
} from './fTimeoutCbk';

import { throttle } from '@/utils/debounce-throttle';

const baseURL = import.meta.env.VITE_BASE_URL_PATH;

// 创建axios实例
const service = axios.create({
    // api 的 base_url
    baseURL,
    timeout: REQUEST_TIMEOUT,
    timeoutErrorMessage: REQUEST_TIMEOUT_MESSAGE,
});

// request拦截器(请求前的处理)
service.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        throw error;
    }
);

// 节流函数
const throttleFTimeoutCbk = throttle(fTimeoutCbk, 3000)
const throttleFLoginInvalidCbk = throttle(fLoginInvalidCbk, 5000)
// response 拦截器(数据返回后的处理)
service.interceptors.response.use(
    (response) => {
        const res = response.data;
        if (res.result != 1) {
            if (res.result == -11) {
                //登录态失效  跳登录
                throttleFLoginInvalidCbk(res);
            }
            throw res;
        } else {
            return res;
        }
    },
    (error) => {
        if (error.message.indexOf(REQUEST_TIMEOUT_MESSAGE) !== -1) {
            throttleFTimeoutCbk();
        }
        throw error;
    }
);

// 中断请求实例工厂函数，https://www.axios-http.cn/docs/cancellation
export const createController = () => new AbortController();

export const request = async (
    url?: string,
    paramsIn?: any,
    method: 'get' | 'GET' | 'post' | 'POST' = 'GET',
    controller?: AbortController
) => {
    const config: AxiosRequestConfig = {
        url,
        method,
        signal: controller?.signal,
    };
    const paramsInField = {
        GET: 'params',
        POST: 'data',
    }[method.toUpperCase()] as 'params' | 'data';
    if (!paramsInField) {
        throw new Error('[REQUEST METHOD ERR]');
    }
    config[paramsInField] = paramsIn;
    return await service.request(config).then((res) => {
        return res;
    });
};

export const get = async (url?: string, params?: any, controller?: AbortController) =>
    await request(url, params, 'get', controller);

export const post = async (url?: string, data?: any, controller?: AbortController) =>
    await request(url, data, 'post', controller);
