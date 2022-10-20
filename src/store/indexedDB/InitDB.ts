/**
 * @title InitDB
 * @author wzdong
 * @export  InitDB
 */

const DB_NAME = 'MY_APP_INDEXED_DB';
const DB_VERSION = 1; // Use a long long for this value (don't use a float)

// 浏览器兼容IndexedDB
const compatIndexedDB = (): IDBFactory => {
    if (!window.indexedDB) {
        console.error(
            "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
        );
    }
    return window.indexedDB;
};

const ERR_MSG = {
    NO_DB: '[IndexedDB] Database not connected yet!',
    OPEN_ERR: '[IndexedDB] Failed to open the database!',
    ABORT_ERR: '[IndexedDB] Database Aborted!',
    GENERAL_ERR: '[IndexedDB] Database Error',
};

const INFO_MSG = {
    DB_CLOSED_INFO: '[indexedDB] Database is closed!',
    STORE_DEL_INFO: '[indexedDB] Store is deleted!',
};

// ------------------------- db ---------------------------
export default function InitDB(
    dbName: string = DB_NAME,
    version: number = DB_VERSION
) {
    //  兼容浏览器
    const indexedDB = compatIndexedDB();
    // 打开数据库，若没有则会创建
    const reqOpenDB = indexedDB.open(dbName, version);
    // db
    let _db: IDBDatabase;
    const checkDB = () => {
        if (!_db) throw new Error(ERR_MSG.NO_DB);
    };

    // ------------------ db listenerHooks
    // 1
    const onDBOpen = (listener: (db: IDBDatabase) => void) => {
        reqOpenDB.onsuccess = function (evt) {
            _db = this.result; // 数据库对象
            listener(_db);
        };
    };
    // 2
    const onDBOpenError = (listener: (target: IDBOpenDBRequest) => void) => {
        reqOpenDB.onerror = function (evt) {
            console.error(ERR_MSG.OPEN_ERR);
            listener(evt.target as IDBOpenDBRequest);
        };
    };
    // 3
    const onDBUpdate = (listener: (db: IDBDatabase) => void) => {
        if (_db) {
            _db.onversionchange = function (evt) {
                listener(this);
            };
        }
        reqOpenDB.onupgradeneeded = function (evt) {
            _db = (evt.currentTarget as IDBOpenDBRequest).result; // 数据库对象
            listener(_db);
        };
    };
    // 4
    const onDBAbort = (
        listener: (db: IDBDatabase, target: IDBOpenDBRequest) => void
    ) => {
        checkDB();
        _db.onabort = function (evt) {
            console.error(ERR_MSG.ABORT_ERR);
            listener(this, evt.target as IDBOpenDBRequest);
        };
    };
    // 5
    const onDBClose = (listener: (db: IDBDatabase) => void) => {
        checkDB();
        _db.onclose = function (evt) {
            console.info(INFO_MSG.DB_CLOSED_INFO);
            listener(this);
        };
    };
    // 6
    const onDBError = (
        listener: (db: IDBDatabase, target: IDBOpenDBRequest) => void
    ) => {
        checkDB();
        _db.onerror = function (evt) {
            console.error(`${ERR_MSG.GENERAL_ERR} \n${evt.target}`);
            listener(this, evt.target as IDBOpenDBRequest);
        };
    };

    // ---------------------------- operate DB
    const closeDB = () => {
        checkDB();
        _db.close();
    };

    const deleteDB = () =>
        new Promise((resolve, reject) => {
            const req = indexedDB.deleteDatabase(dbName);
            req.onsuccess = resolve;
            req.onerror = reject;
        });

    // ----------------------------- store
    // 写在onDBOpen，或onDBUpdate里面

    // 创建store(ObjectStore)
    const createStore = (
        storeName: string,
        keyPathOptions: IDBObjectStoreParameters,
        indexList?: {
            name: string;
            options?: IDBIndexParameters;
        }[]
    ): boolean => {
        checkDB();
        if (_db.objectStoreNames.contains(storeName)) return false;
        const store = _db.createObjectStore(storeName, keyPathOptions);
        indexList?.forEach(({ name, options }) => {
            store.createIndex(name, name, options);
        });
        return !!store;
    };

    // 删除store(ObjectStore)
    const deleteStore = (storeName: string): boolean => {
        checkDB();
        if (!_db.objectStoreNames.contains(storeName)) return false;
        _db.deleteObjectStore(storeName);
        console.info(`${INFO_MSG.STORE_DEL_INFO} ${storeName}`);
        return true;
    };

    // 建立事务获取store(ObjectStore)
    const getStore = (
        storeName: string,
        mode: IDBTransactionMode
    ): IDBObjectStore => {
        checkDB();
        let tx: IDBTransaction;
        try {
            tx = _db.transaction(storeName, mode);
        } catch (err) {
            throw new Error(
                `[IndexDB] Store named ${storeName} cannot be found in the database`
            );
        }
        return tx.objectStore(storeName);
    };

    // 增
    const add = (store: IDBObjectStore, data: any) =>
        new Promise((resolve, reject) => {
            const req = store.add(data);
            req.onsuccess = resolve;
            req.onerror = reject;
        });

    // 改
    const put = (store: IDBObjectStore, data: any) =>
        new Promise((resolve, reject) => {
            const req = store.put(data);
            req.onsuccess = resolve;
            req.onerror = reject;
        });

    // 查
    // 根据 主键 keyPath 查询
    const get = (
        store: IDBObjectStore,
        keyPathValue?: IDBValidKey | IDBKeyRange
    ): Promise<any> =>
        new Promise((resolve, reject) => {
            const req = keyPathValue ? store.get(keyPathValue) : store.getAll();
            req.onsuccess = (evt) => {
                resolve((evt.target as IDBRequest).result);
            };
            req.onerror = reject;
        });
    // 根据 索引 Index 查询（游标）
    const getByIndex = (
        store: IDBObjectStore,
        indexName: string,
        indexValue: IDBValidKey | IDBKeyRange,
        direction?: IDBCursorDirection
    ) =>
        new Promise((resolve, reject) => {
            const req = store
                .index(indexName)
                .openCursor(indexValue, direction);
            const list: any[] = [];
            req.onsuccess = (evt) => {
                const cursor: IDBCursorWithValue = (evt.target as IDBRequest)
                    .result;
                if (cursor) {
                    list.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(list);
                }
            };
            req.onerror = reject;
        });

    // 删
    // 根据 主键 keyPath 删除
    const remove = (
        store: IDBObjectStore,
        keyPathValue: IDBValidKey | IDBKeyRange
    ) =>
        new Promise((resolve, reject) => {
            const req = store.delete(keyPathValue);
            req.onsuccess = (evt) => {
                resolve((evt.target as IDBRequest).result);
            };
            req.onerror = reject;
        });
    // 根据 索引 Index 删除（游标）
    const removeByIndex = (
        store: IDBObjectStore,
        indexName: string,
        indexValue: IDBValidKey | IDBKeyRange,
        direction?: IDBCursorDirection
    ) =>
        new Promise((resolve, reject) => {
            const req = store
                .index(indexName)
                .openCursor(indexValue, direction);
            req.onsuccess = (evt) => {
                const cursor: IDBCursorWithValue = (evt.target as IDBRequest)
                    .result;
                if (cursor) {
                    const reqDelete = cursor.delete();
                    reqDelete.onerror = () => {
                        console.error(
                            `[IndexDB] Failed to delete the record ${cursor}`
                        );
                    };
                    reqDelete.onsuccess = () => {};
                    cursor.continue();
                } else {
                    resolve({ delete: 'done' });
                }
            };
            req.onerror = reject;
        });

    return {
        onDBOpen,
        onDBAbort,
        onDBClose,
        onDBError,
        onDBOpenError,
        onDBUpdate,

        closeDB,
        deleteDB,

        createStore,
        deleteStore,
        getStore,
        add,
        put,
        get,
        getByIndex,
        remove,
        removeByIndex,
    };
}
