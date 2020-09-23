export default {
    set(value: object, callback: any, type?: string): void {
        (type === 'sync' ? chrome.storage.sync : chrome.storage.local).set(value, callback)
    },
    get(keys: string[], callback: any, type?: string): void {
        (type === 'sync' ? chrome.storage.sync : chrome.storage.local).get(keys, callback)
    }
}