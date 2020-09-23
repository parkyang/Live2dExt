export default {
    getExtensionId() {
        const m = chrome.extension.getURL('').match(/\/+(\w+)\/$/i);
        return m && m[1] || '';
    }
}