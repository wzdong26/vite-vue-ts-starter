import { ref, Ref, reactive } from 'vue-demi';

interface UsePromiseOptions<T> {
    onComplete?: (res: any) => T | void;
    onError?: (err: any) => void;
    triggerDirectly?: boolean;
}

interface UsePromiseReturns<T> {
    data: Ref<T | undefined>;
    status: {
        loading: boolean;
        complete: boolean;
    };
    trigger: (...args: any[]) => Promise<any>;
}

export default function usePromise<T = any>(
    promiseFcn: (...args: any) => Promise<any>,
    args?: any[],
    usePromiseOptions?: UsePromiseOptions<T>
): UsePromiseReturns<T> {
    const data = ref<T>();
    const status = reactive({
        loading: false,
        complete: false,
    });
    const { onError, onComplete, triggerDirectly } = usePromiseOptions || {};
    const trigger = (...newArgs: any[]) => {
        status.loading = true;
        status.complete = false;
        const finalArgs = Object.values({
            ...(args ?? []),
            ...(newArgs ?? []),
        });
        return promiseFcn(...finalArgs)
            .then((res) => {
                data.value = onComplete?.(res) ?? res;
                status.complete = true;
            })
            .catch(onError)
            .finally(() => (status.loading = false));
    };
    if (triggerDirectly) {
        trigger(...(args ?? []));
    }

    return {
        data,
        status,
        trigger,
    };
}
