const tabs: any = chrome.tabs;
function getTab(queryInfo: (o: object) => void | object, callback?: () => void) {
    tabs.query(
        typeof queryInfo === 'function'
            ? {
                  active: true,
                  currentWindow: true,
              }
            : queryInfo,
        (tabs: []) => {
            const tab: any = tabs.shift();
            const _call: (t: chrome.tabs.Tab) => void = typeof queryInfo === 'function' ? queryInfo : callback || ((t: chrome.tabs.Tab) => {});
            _call(tab && tab.id ? tab : null);
        }
    );
}

export default {
    getTab,
};
