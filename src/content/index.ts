import Observer from './Observer'
import Storage from '@CLib/storage'
import Axios from 'axios'
const injectJs: (p: string) => Promise<any> = (jsPath: string) => {
  const temp: any = document.createElement('script')
  temp.setAttribute('type', 'text/javascript')
  temp.src = chrome.extension.getURL(jsPath)
  return new Promise((resolve, reject) => {
    temp.onload = () => {
      // 放在页面不好看，执行完后移除掉
      temp.parentNode.removeChild(temp)
      resolve()
    }
    temp.onerror = (err: any) => {
      reject(err)
    }
    document.head.appendChild(temp)
  })
}
interface Live2DExtConfig {
  index: number
  date: number
  isHide: boolean
  modelIndex: number
}

Storage.get(['live2d.config'], (result: object) => {
  const nowTime: Date = new Date()
  const localCfg: Live2DExtConfig = Object.assign(
    {},
    {
      index: 0,
      date: nowTime.getDate(),
      isHide: false,
      modelIndex: 0,
    },
    result['live2d.config'] || {}
  )
  if (localCfg.isHide) return
  Observer.onHeadLoaded((): void => {
    injectJs('js/live2d.js').then(() => {
      injectJs('initLive2D.js').then(() => {
        Axios.get(chrome.extension.getURL('modelConfig.json'))
          .then((response: any) => {
            const script = document.createElement('script')
            script.innerHTML = `if (!window.Live2DExt) {
              window.Live2DExt = {};
            }
            window.Live2DExt.models = ${JSON.stringify(response.data)}`
            document.body.appendChild(script)
            document.body.removeChild(script)
            window.dispatchEvent(
              new CustomEvent('Live2DExt.init', {
                detail: {
                  path: chrome.extension.getURL('js/'),
                  date: localCfg.date,
                  index: localCfg.index || 0,
                  isHide: localCfg.isHide,
                },
              } as CustomEventInit)
            )
          })
          .catch((err) => {
            console.error('Live2DExt.error', err)
          })
        // delete localCfg['live2d.config']
        Storage.set({ 'live2d.config': localCfg }, () => {})
      })
    })
  })
  Observer.init()
})

window.addEventListener('Live2DExt.change', (e: any) => {
  Storage.set({ 'live2d.config': (e as CustomEvent).detail }, () => {})
})
