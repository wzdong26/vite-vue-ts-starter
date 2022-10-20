/**
 * @title useForm
 * @description composition api useForm
 * @params useFormOptions: UseFormOptions<T>
 * @return { form: UnwrapNestedRefs<T> (reactive); valid: (key?: keyof T) => boolean }
 */

import { reactive, toRaw } from 'vue-demi';

type Form = Record<string, any>;

interface Rule<T> {
    validator: (val: T) => boolean;
    inValidCbk?: (val: T) => void;
    message?: string;
}

interface UseFormOption<T> {
    $value: T;
    $rules?: Rule<T>[];
    $format?: (val: T) => any;
}

type UseFormOptions<T extends Form> = {
    [K in keyof T]: UseFormOption<T[K]> | T[K];
};

type Rules<T extends Form> = {
    [K in keyof T]: Rule<T[K]>[];
};

export default function useForm<T extends Form>(
    useFormOptions: UseFormOptions<T>
) {
    const rawForm: T = {} as any;
    const rules: Rules<T> = {} as any;
    Object.entries(useFormOptions).forEach(([key, val]) => {
        rawForm[key as keyof T] = val?.$value ?? val;
        rules[key as keyof T] = val?.$rules;
    });
    let form = reactive<T>(rawForm);
    // 校验表单
    const valid = (...keys: Array<keyof T>): boolean => {
        const validFcn = <K extends keyof T>(
            key: K,
            useFormOption: UseFormOption<T[K]>
        ) => {
            const { $rules } = useFormOption || {};
            if (!$rules?.length) return true;
            return $rules.every(({ validator, inValidCbk, message }) => {
                if (!validator) return true;
                const isValid = validator(form[key]);
                if (!isValid) {
                    inValidCbk?.(form[key]);
                }
                return isValid;
            });
        };
        if (keys?.length) {
            return keys.every((key) => {
                const useFormOption = useFormOptions[key];
                return validFcn(key, useFormOption);
            });
        }
        return Object.entries(useFormOptions).every(([key, useFormOption]) =>
            validFcn(key, useFormOption)
        );
    };
    // 格式化表单
    const format = (...keys: Array<keyof T>): T => {
        const formattedForm = { ...form };
        if (keys?.length) {
            keys.forEach((key) => {
                const { $format } = useFormOptions[key];
                if (!$format) return;
                formattedForm[key] = $format(form[key]);
            });
        } else {
            Object.entries(useFormOptions).forEach(([key, { $format }]) => {
                if (!$format) return;
                formattedForm[key as keyof T] = $format(form[key]);
            });
        }
        return formattedForm;
    };
    function changeForm(newForm: Partial<T>) {
        Object.entries(newForm).forEach(([k, v]) => {
            form[k as keyof T] = newForm[k] ?? v
        })
    }
    return { form, rules, valid, format, changeForm };
}
