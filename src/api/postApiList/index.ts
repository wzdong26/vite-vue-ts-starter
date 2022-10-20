import { post, createController } from '../request';


// 当前接口scriptName唯一标识
const commonPost = async (scriptName: string, params?: object, signal?: AbortSignal) => await post(undefined, { scriptName, ...(params ?? {}) }, signal);

const _Post = (apiName: string) => async (params?: object, signal?: AbortSignal) => await commonPost(`${apiName}`, params, signal);
const ptsPost = (apiName: string) => async (params?: object, signal?: AbortSignal) => await commonPost(`pts.${apiName}`, params, signal);


export { createController }


// 登录
export const getVerifyCode = _Post('getVerifyCode')
export const dpatrolLogin = ptsPost('dpatrolLogin')
