import MSGENUM from './common/enum'
import MessageData from './common/messageData'
import ExtensionDetail from '@CLib/extension'

/**
 * ContentMessage class
 * 1. from background : onMessage()
 * 2. from popup : onMessageP()
 * 3. to background : sendMessage()
 */

interface EventItem {
    name: string
    callback: (msg: any, port: chrome.runtime.Port) => void
    type: MSGENUM
}
const eventList: EventItem[] = []
let isInitedOnConnect: boolean = false
type callbackType = (d: any, s: chrome.runtime.MessageSender, se: (r: any) => void) => void

export class ContentMessage {
    constructor() {}

    static get type() {
        return MSGENUM.CONTENT
    }

    /**
     * sendMessage to background
     * (chrome.runtime.sendMessage)
     * @param type 消息类型(名称)
     * @param data 消息内容
     * @param options chrome.runtime.sendMessage's options
     * @param responseCallback 回调函数
     */
    static sendMessage(type: string, data: any, options?: object, responseCallback?: (response: any) => void) {
        chrome.runtime.sendMessage(ExtensionDetail.getExtensionId(), new MessageData(MSGENUM.POPUP, type, data), options || {}, void (responseCallback || (() => {})))
    }

    /**
     * onMessage from Background
     * (chrome.runtime.onMessage.addListener)
     * @param type 消息类型(名称)
     * @param callback 回调函数 params: (data: any, sender: any, sendResponse: () => void)
     */
    static onMessage(type: string, callback: callbackType) {
        chrome.runtime.onMessage.addListener((msgData: MessageData, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
            if (msgData.from === MSGENUM.BACKGROUND && type === msgData.type) {
                callback(msgData.data, sender, sendResponse)
            }
        })
    }

    /**
     * onMessage from popup
     * (chrome.runtime.onMessage.addListener)
     * @param type 消息类型(名称)
     * @param callback 回调函数 params: (data: any, sender: any, sendResponse: () => void)
     */
    static onMessageP(type: string, callback: callbackType) {
        chrome.runtime.onMessage.addListener((msgData: MessageData, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
            if (msgData.from === MSGENUM.POPUP && type === msgData.type) {
                callback(msgData.data, sender, sendResponse)
            }
        })
    }

    /**
     * 发送消息长连接
     * @param connectInfo 名称或链接信息
     */
    static connect(connectInfo: string | chrome.runtime.ConnectInfo) {
        const info: chrome.runtime.ConnectInfo = typeof connectInfo === 'string' ? { name: connectInfo } : connectInfo
        if (info.name) {
            info.name = `${MSGENUM.CONTENT}.${info.name}`
        }
        return chrome.runtime.connect(info)
    }

    static initOnConnect(callback: (p: chrome.runtime.Port) => void = () => {}) {
        if (isInitedOnConnect) return
        isInitedOnConnect = true
        chrome.runtime.onConnect.addListener((port: chrome.runtime.Port) => {
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
            ContentMessage.initOnConnect()
        }
        if (
            !eventList.filter((item: EventItem) => {
                return item.name === `${type || MSGENUM.BACKGROUND}.${name}` && callback === item.callback
            }).length
        ) {
            eventList.push({
                name,
                callback,
                type: type || MSGENUM.BACKGROUND,
            })
        }
    }
}

export default ContentMessage
