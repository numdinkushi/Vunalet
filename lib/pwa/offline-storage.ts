// Define proper types for offline storage
interface OrderData {
    buyerId: string;
    farmerId: string;
    products: Array<{
        productId: string;
        name: string;
        price: number;
        quantity: number;
        unit: string;
    }>;
    totalAmount: number;
    deliveryAddress: string;
    paymentMethod: 'lisk_zar' | 'cash';
    orderStatus: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'in_transit' | 'arrived' | 'delivered' | 'cancelled';
    createdAt: number;
}

interface ProductData {
    id: string;
    name: string;
    price: number;
    category: string;
    description: string;
    images: string[];
    farmerId: string;
    status: 'active' | 'inactive';
}

interface UserData {
    profile: Record<string, unknown>;
    preferences: Record<string, unknown>;
    settings: Record<string, unknown>;
}

interface OfflineOrder {
    id: string;
    data: OrderData;
    timestamp: number;
    synced: boolean;
}

interface OfflineData {
    orders: OfflineOrder[];
    products: ProductData[];
    userData: UserData;
}

class OfflineStorageService {
    private dbName = 'VunaletOfflineDB';
    private dbVersion = 1;
    private db: IDBDatabase | null = null;

    async initialize(): Promise<boolean> {
        if (!('indexedDB' in window)) {
            console.warn('IndexedDB is not supported');
            return false;
        }

        return new Promise((resolve) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                console.error('Failed to open IndexedDB');
                resolve(false);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('IndexedDB initialized successfully');
                resolve(true);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // Create object stores
                if (!db.objectStoreNames.contains('orders')) {
                    const orderStore = db.createObjectStore('orders', { keyPath: 'id' });
                    orderStore.createIndex('timestamp', 'timestamp', { unique: false });
                    orderStore.createIndex('synced', 'synced', { unique: false });
                }

                if (!db.objectStoreNames.contains('products')) {
                    const productStore = db.createObjectStore('products', { keyPath: 'id' });
                    productStore.createIndex('category', 'category', { unique: false });
                }

                if (!db.objectStoreNames.contains('userData')) {
                    db.createObjectStore('userData', { keyPath: 'key' });
                }

                console.log('IndexedDB schema updated');
            };
        });
    }

    // Order management
    async saveOfflineOrder(orderData: OrderData): Promise<string> {
        if (!this.db) {
            throw new Error('IndexedDB not initialized');
        }

        const order: OfflineOrder = {
            id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            data: orderData,
            timestamp: Date.now(),
            synced: false,
        };

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['orders'], 'readwrite');
            const store = transaction.objectStore('orders');
            const request = store.add(order);

            request.onsuccess = () => resolve(order.id);
            request.onerror = () => reject(request.error);
        });
    }

    async getOfflineOrders(): Promise<OfflineOrder[]> {
        if (!this.db) {
            return [];
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['orders'], 'readonly');
            const store = transaction.objectStore('orders');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getUnsyncedOrders(): Promise<OfflineOrder[]> {
        if (!this.db) {
            return [];
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['orders'], 'readonly');
            const store = transaction.objectStore('orders');
            const index = store.index('synced');
            const request = index.getAll(IDBKeyRange.only(false));

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async markOrderAsSynced(orderId: string): Promise<void> {
        if (!this.db) {
            return;
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['orders'], 'readwrite');
            const store = transaction.objectStore('orders');
            const getRequest = store.get(orderId);

            getRequest.onsuccess = () => {
                const order = getRequest.result;
                if (order) {
                    order.synced = true;
                    const putRequest = store.put(order);
                    putRequest.onsuccess = () => resolve();
                    putRequest.onerror = () => reject(putRequest.error);
                } else {
                    resolve();
                }
            };
            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    async deleteOrder(orderId: string): Promise<void> {
        if (!this.db) {
            return;
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['orders'], 'readwrite');
            const store = transaction.objectStore('orders');
            const request = store.delete(orderId);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Product caching
    async cacheProducts(products: ProductData[]): Promise<void> {
        if (!this.db) {
            return;
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['products'], 'readwrite');
            const store = transaction.objectStore('products');

            // Clear existing products
            store.clear();

            // Add new products
            products.forEach((product) => {
                store.add(product);
            });

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }

    async getCachedProducts(): Promise<ProductData[]> {
        if (!this.db) {
            return [];
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['products'], 'readonly');
            const store = transaction.objectStore('products');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getCachedProductsByCategory(category: string): Promise<ProductData[]> {
        if (!this.db) {
            return [];
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['products'], 'readonly');
            const store = transaction.objectStore('products');
            const index = store.index('category');
            const request = index.getAll(category);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // User data storage
    async saveUserData(key: string, data: Record<string, unknown>): Promise<void> {
        if (!this.db) {
            return;
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['userData'], 'readwrite');
            const store = transaction.objectStore('userData');
            const request = store.put({ key, data });

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getUserData(key: string): Promise<Record<string, unknown> | null> {
        if (!this.db) {
            return null;
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['userData'], 'readonly');
            const store = transaction.objectStore('userData');
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result?.data || null);
            request.onerror = () => reject(request.error);
        });
    }

    // Cleanup old data
    async cleanupOldData(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
        if (!this.db) {
            return;
        }

        const cutoffTime = Date.now() - maxAge;

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['orders'], 'readwrite');
            const store = transaction.objectStore('orders');
            const index = store.index('timestamp');
            const request = index.openCursor(IDBKeyRange.upperBound(cutoffTime));

            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor) {
                    cursor.delete();
                    cursor.continue();
                } else {
                    resolve();
                }
            };
            request.onerror = () => reject(request.error);
        });
    }

    // Get storage statistics
    async getStorageStats(): Promise<{ orders: number; products: number; userData: number; }> {
        if (!this.db) {
            return { orders: 0, products: 0, userData: 0 };
        }

        const orders = await this.getOfflineOrders();
        const products = await this.getCachedProducts();
        const userData = await this.getAllUserDataKeys();

        return {
            orders: orders.length,
            products: products.length,
            userData: userData.length,
        };
    }

    private async getAllUserDataKeys(): Promise<string[]> {
        if (!this.db) {
            return [];
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['userData'], 'readonly');
            const store = transaction.objectStore('userData');
            const request = store.getAllKeys();

            request.onsuccess = () => resolve(request.result as string[]);
            request.onerror = () => reject(request.error);
        });
    }
}

// Export singleton instance
export const offlineStorage = new OfflineStorageService(); 