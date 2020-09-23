import Vue, { VNode } from 'vue'
import * as Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import AppComponent from './App/App.vue'
// PopupMessage.onMessageByContent('content.msg', (data: any, sender: any, sendResponse: () => void) => {
//   console.log('popup message', data)
// })
Vue.use(Element)

Vue.component('app-component', AppComponent)

new Vue({
  el: '#app',
  render(createElement): VNode {
    return createElement(AppComponent)
  },
})
