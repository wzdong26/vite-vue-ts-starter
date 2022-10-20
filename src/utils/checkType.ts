/**
 * @title check type
 * @description 基本常用类型检查，转换
 */


export const isNumber = (value: any): value is number => typeof value === 'number'
export const isNaNNum = (value: any) => Number.isNaN(value)
export const isFiniteNum = (value: any) => Number.isFinite(value)
export const isInfinity = (value: any) => isNumber(value) && !isFiniteNum(value) && !isNaNNum(value)

export const isString = (value: any): value is string => typeof value === 'string'

export const isBoolean = (value: any): value is boolean => typeof value === 'boolean'

export const isUndefined = (value: any): value is undefined => typeof value === 'undefined'

export const isSymbol = (value: any): value is boolean => typeof value === 'symbol'

export const isArray = <T = any>(value: any): value is Array<T> => Array.isArray(value)

export const isNull = (value: any): value is null => value === null

export const isDate = (value: any): value is Date => value instanceof Date



// JSON.stringify问题：
// 对象中有时间类型的时候，序列化之后会变成字符串类型。
// 对象中有undefined和Function类型以及symbol值数据的时候，序列化之后会直接丢失。
// 对象中有NaN、Infinity和-Infinity的时候，序列化之后会显示null。
// 对象循环引用的时候，会直接报错。
export const jsonStringify = (value: any): string => JSON.stringify(value, (key, value) => {
    if (isUndefined(value)) return ''
    if (isNaNNum(value) || isInfinity(value)) return `${value}`
    return value
})

export const jsonParse = (text: string): any => JSON.parse(text, (key, value) => {
    if (['-Infinity', 'Infinity', 'NaN'].includes(value)) return parseFloat(value);
    return value
})
