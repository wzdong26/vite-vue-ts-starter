import InitDB from './InitDB';

type Data = Record<string, Exclude<any, object>>;

export default function InitComStore<T extends Data>(
    storeName: string,
    keyPathOptions: IDBObjectStoreParameters
) {
    const {
        onDBOpen: _onDBOpen,
        closeDB,
        createStore,
        getStore,
        get,
        put,
        remove,
    } = InitDB();

    function onDBOpen(listener: (db: IDBDatabase) => void) {
        _onDBOpen((db) => {
            createStore(storeName, keyPathOptions);
            listener(db);
        });
    }

    function getData(keyPathValue: T[keyof T]) {
        return get(getStore(storeName, 'readonly'), keyPathValue);
    }
    function putData(data: T) {
        return put(getStore(storeName, 'readwrite'), data);
    }
    function removeData(keyPathValue: T[keyof T]) {
        return remove(getStore(storeName, 'readwrite'), keyPathValue);
    }

    return { onDBOpen, getData, putData, removeData, closeDB };
}
