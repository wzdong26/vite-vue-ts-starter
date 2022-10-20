/**
 * @title LocalStore
 * @description e.g., const lStoreUser = new LocalStore('user'); lStoreUser.get(); lStoreUser.set('name'); 
 */

import { jsonStringify, jsonParse, isNull } from '@/utils/checkType'

export class LocalStore {
    key: string
    value: any
    constructor(key: string) {
        this.key = key
    }
    _stringifyValue(value: any = this.value): string {
        return jsonStringify(value)
    }
    _parseValue(text: string): any {
        return this.value = jsonParse(text)
    }
    set(value: any): boolean {
        const finalKey = this.key
        if (!finalKey) return false
        this.value = value
        const text = this._stringifyValue(value)
        localStorage.setItem(this.key, text)
        return true
    }
    get(key?: string): any {
        const finalKey = key ?? this.key
        if (!finalKey) return null
        const localStoreVal = localStorage.getItem(finalKey)
        if (isNull(localStoreVal)) return localStoreVal
        return this._parseValue(localStoreVal)
    }
    clear(key?: string): boolean {
        const finalKey = key ?? this.key
        if (!finalKey) return false
        localStorage.removeItem(finalKey)
        return true
    }
}
