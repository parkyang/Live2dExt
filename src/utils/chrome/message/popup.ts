import MSGENUM from './common/enum'
import MessageData from './common/messageData'
import ChromeTabs from '../tabs'
/**
 * PopupMessage class
 * 1. to content : sendMessageTC() or sendMessageTCTab()
 * 2. to background : BACKGROUNDPAGE属性,通过 chrome.extension.getBackgroundPage 直接访问
 */

// interface EventItem {
//     name: string
//     callback: () => void
//     type: MSGENUM
// }
// const eventList: EventItem[] = []
// let isInitedOnConnect: boolean = false

export class PopupMessage {
    constructor() {}
    static get type() {
        return MSGENUM.POPUP
    }

    /**
     * getBackground's js Object
     * to background : 通过 chrome.extension.getBackgroundPage 直接访问
     */
    static get BACKGROUNDPAGE(): any {
        return chrome.extension.getBackgroundPage()
    }

    /**
     * sendMessage to current tab [content]
     * to content : chrome.tabs.sendMessage
     * @param type 消息类型(名称)
     * @param data 消息内容
     * @param options chrome.runtime.sendMessage's options
     * @param responseCallback 回调函数
     */
    static sendMessage(type: string, data: any, options?: object, responseCallback?: () => void) {
        ChromeTabs.getTab((tabs: []) => {
            const tab: any = tabs.shift()
            if (tab && tab.id) {
                chrome.tabs.sendMessage(tab.id, new MessageData(MSGENUM.POPUP, type, data), options || {}, void responseCallback)
            }
        })
    }

    /**
     * sendMessage by tab'id [content]
     * to content : chrome.tabs.sendMessage
     * @param type 消息类型(名称)
     * @param data 消息内容
     * @param options chrome.runtime.sendMessage's options
     * @param responseCallback 回调函数
     */
    static sendMessageTab(tabId: number, type: string, data: any, options?: object, responseCallback?: () => void) {
        chrome.tabs.sendMessage(tabId, new MessageData(MSGENUM.POPUP, type, data), options || {}, void responseCallback)
    }

    /**
     * onMessageByContent [content]
     * from content : chrome.runtime.onMessage.addListener
     * @param type 消息类型(名称)
     * @param callback 回调函数 params: (data: any, sender: any, sendResponse: () => void)
     */
    // static onMessageByContent(type: string, callback: () => void) {
    //     chrome.runtime.onMessage.addListener((msgData: MessageData, sender: any, sendResponse: () => void) => {
    //         if (type === msgData.type) {
    //             callback(msgData.data, sender, sendResponse);
    //         }
    //     });
    // }

    // /**
    //  * 发送消息长连接
    //  * @param connectInfo 名称或链接信息
    //  */
    // static connect(connectInfo: string | chrome.runtime.ConnectInfo) {
    //     let info = typeof connectInfo === 'string' ? { name: connectInfo } : connectInfo;
    //     if (info.name) {
    //         info.name = `${MSGENUM.POPUP}.${info.name}`;
    //     }
    //     return chrome.runtime.connect(info);
    // }

    // static initOnConnect(callback?: () => void) {
    //     if (isInitedOnConnect) return;
    //     isInitedOnConnect = true;
    //     chrome.runtime.onConnect.addListener((port: any) => {
    //         typeof callback === 'function' && callback(port);
    //         eventList.map((item: EventItem) => {
    //             if (`${port.name}` === item.name) {
    //                 port.onMessage.addListener((msg: any) => {
    //                     item.callback(msg, port);
    //                 })
    //             }
    //         })
    //     });
    // }

    // /**
    //  * 监听长连接 (port.receive and port.send)
    //  * @param connectInfo 名称或链接信息
    //  */
    // static onConnect(name: string, callback: () => void, type?: MSGENUM) {
    //     if (!isInitedOnConnect) {
    //         PopupMessage.initOnConnect();
    //     }
    //     if (!eventList.filter((item: EventItem) => {
    //         return item.name === `${type || MSGENUM.CONTENT}.${name}` && callback === item.callback
    //     }).length) {
    //         eventList.push({
    //             name,
    //             callback,
    //             type: type || MSGENUM.CONTENT
    //         } as EventItem)
    //     }
    // }
}

export default PopupMessage
