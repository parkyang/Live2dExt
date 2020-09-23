import Storage from '@CLib/storage'

const w: any = window
w.setCfg = (val: any): void => {
  Storage.set({ 'live2d.config': val }, () => {})
}
w.getCfg = (callback: (v: any) => {}): any => {
  Storage.get(['live2d.config'], (val: any) => {
    callback(val['live2d.config'])
  })
}

// BackgroundMsg.onMessage('content.msg', (data: any): void => {
//   console.log('background msg:', data)
//   BackgroundMsg.sendMessage('background.msg', 'from background')
// })

// BackgroundMsg.initOnConnect((port: any) => {
//   console.log('content.onconnect init', port)
// })
// BackgroundMsg.onConnect('content.connect', (msg: any) => {
//   console.log('content.onconnect', msg)
// })
