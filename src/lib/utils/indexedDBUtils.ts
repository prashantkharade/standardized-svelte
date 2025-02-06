// IndexedDB Utility Functions

export async function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('offlineFormData', 1);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains('submissions')) {
                db.createObjectStore('submissions', { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function storeInIndexedDB(formName: string, data: Record<string, any>): Promise<void> {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('submissions', 'readwrite');
        const store = transaction.objectStore('submissions');
        const record = { formName, data, timestamp: Date.now() };

        const request = store.add(record);
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
}

export async function getAllFromIndexedDB(formName: string): Promise<Record<string, any>[]> {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('submissions', 'readonly');
        const store = transaction.objectStore('submissions');
        const request = store.getAll();

        request.onsuccess = () => {
            const results = request.result.filter((item) => item.formName === formName);
            resolve(results.map((item) => item.data));
        };
        request.onerror = () => reject(request.error);
    });
}

export async function clearIndexedDB(formName: string): Promise<void> {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('submissions', 'readwrite');
        const store = transaction.objectStore('submissions');

        // Delete records matching the formName
        const request = store.openCursor();
        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result;
            if (cursor) {
                if (cursor.value.formName === formName) {
                    cursor.delete();
                }
                cursor.continue();
            }
        };
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
}
