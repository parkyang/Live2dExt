import MSGENUM from './common/enum'
import MessageData from './common/messageData'
import ChromeTabs from '../tabs'
/**
 * BackgroundMessage class
 * 1. from content : onMessage()
 * 2. to content : sendMessage() or sendMessageTab()
 * 3. from popup : popup 通过 chrome.extension.getBackgroundPage 直接访问
 */

interface EventItem {
    name: string
    callback: (msg: any, port: chrome.runtime.Port) => void
    type: MSGENUM
}
const eventList: EventItem[] = []
let isInitedOnConnect:boolean = false
type callbackType = (d: any, s: chrome.runtime.MessageSender, se: (r: any) => void) => void

export class BackgroundMessage {
    /**
     * target
     */
    static get type() {
        return MSGENUM.BACKGROUND
    }

    /**
     * send to current tab
     * (chrome.tabs.sendMessage)
     * @param type 消息类型(名称)
     * @param data 消息内容
     * @param options chrome.runtime.sendMessage's options
     * @param responseCallback 回调函数
     */
    static sendMessage(type: string, data: any, options?: object, responseCallback?: (response: any) => void) {
        ChromeTabs.getTab((tab: any): void | object => {
            if (tab) {
                chrome.tabs.sendMessage(tab.id, new MessageData(MSGENUM.BACKGROUND, type, data), options || {}, void responseCallback)
            } else {
                console.error('sendMessage(background): tab is undefined', tab)
            }
        })
    }

    /**
     * send to tab
     * (chrome.tabs.sendMessage)
     * @param tabId tab's id
     * @param type 消息类型(名称)
     * @param data 消息内容
     * @param responseCallback 回调函数
     */
    static sendMessageTab(tabId: number, type: string, data: any, options?: object, responseCallback?: (response: any) => void) {
        chrome.tabs.sendMessage(tabId, new MessageData(MSGENUM.CONTENT, type, data), options || {}, void responseCallback)
    }

    /**
     * onMessage from content
     * (chrome.runtime.onMessage.addListener)
     * @param type 消息类型(名称)
     * @param callback 回调函数 params: (data: any, sender: any, sendResponse: () => void)
     */
    static onMessage(type: string, callback: callbackType) {
        chrome.runtime.onMessage.addListener((msgData: MessageData, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
            if (type === msgData.type) {
                callback(msgData.data, sender, sendResponse)
            }
        })
    }

    /**
     * 发送消息长连接
     * @param connectInfo 名称或链接信息
     * @return Promise
     */
    static connect(connectInfo: string | chrome.runtime.ConnectInfo): Promise<any> {
        const info = typeof connectInfo === 'string' ? { name: connectInfo } : connectInfo
        if (info.name) {
            info.name = `${MSGENUM.BACKGROUND}.${info.name}`
        }
        return new Promise((resolve: (r: any) => void, reject: (r: any) => void) => {
            ChromeTabs.getTab((tab: chrome.tabs.Tab) => {
                if (tab && tab.id) {
                    resolve(chrome.tabs.connect(tab.id, info))
                } else {
                    const errMsg = 'connect(background): tab is undefined'
                    console.error(errMsg, tab)
                    reject(errMsg)
                }
            })
        })
    }

    /**
     * 发送消息长连接
     * @param connectInfo 名称或链接信息
     */
    static connectTab(tabId: number, connectInfo: string | chrome.runtime.ConnectInfo) {
        const info:chrome.runtime.ConnectInfo = typeof connectInfo === 'string' ? { name: connectInfo } : connectInfo
        if (info.name) {
            info.name = `${MSGENUM.BACKGROUND}.${info.name}`
        }
        return chrome.tabs.connect(tabId, info)
    }

    static initOnConnect(callback?: (p: chrome.runtime.Port) => void) {
        if (isInitedOnConnect) return
        isInitedOnConnect = true
        chrome.runtime.onConnect.addListener((port: any) => {
            typeof callback === 'function' && callback(port)
            eventList.map((item: EventItem) => {
                if (`${port.name}` === item.name) {
                    port.onMessage.addListener((msg: any) => {
                        item.callback(msg, port)
                    })
                }
            })
        })
    }

    /**
     * 监听长连接 (port.receive and port.send)
     * @param connectInfo 名称或链接信息
     */
    static onConnect(name: string, callback: (msg: any, p: chrome.runtime.Port) => void, type?: MSGENUM) {
        if (!isInitedOnConnect) {
            BackgroundMessage.initOnConnect()
        }
        if (
            !eventList.filter((item: EventItem) => {
                return item.name === `${type || MSGENUM.CONTENT}.${name}` && callback === item.callback
            }).length
        ) {
            eventList.push({
                name: `${type || MSGENUM.CONTENT}.${name}`,
                callback,
                type: type || MSGENUM.CONTENT,
            } as EventItem)
        }
    }
}

export default BackgroundMessage
