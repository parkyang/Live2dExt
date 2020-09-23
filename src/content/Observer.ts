class EventList {
    static headEventList: (() => void)[] = []
    static bodyEventList: (() => void)[] = []
}
export default class Observer {
    static onHeadLoaded(fn: () => void) {
        if (!EventList.headEventList.filter((f: () => void) => f === fn).length) EventList.headEventList.push(fn)
    }
    static onBodyLoaded(fn: () => void) {
        if (!EventList.bodyEventList.filter((f: object) => f === fn).length) EventList.bodyEventList.push(fn)
    }
    static init() {
        let isHeadLoaded = false
        let isBodyLoaded = false

        // Select the node that will be observed for mutations
        const targetNode = document.querySelector('html')
        if (!targetNode) return

        // Options for the observer (which mutations to observe)
        const config = {
            attributes: true,
            childList: true,
            subtree: true,
        }

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(() => {
            try {
                const head = document.querySelector('head')
                const bd = document.body
                if (head && !isHeadLoaded) {
                    isHeadLoaded = true
                    EventList.headEventList && EventList.headEventList.map((f: object) => typeof f === 'function' && f(isHeadLoaded))
                }
                if (bd && !isBodyLoaded) {
                    observer.disconnect()
                    isBodyLoaded = true
                    EventList.bodyEventList && EventList.bodyEventList.map((f: object) => typeof f === 'function' && f(isBodyLoaded))
                }
            } catch (e) {
                observer.disconnect()
            }
        })

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config)
        // Later, you can stop observing
        return observer
    }
}
