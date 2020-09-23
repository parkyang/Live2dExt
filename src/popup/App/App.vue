<template>
  <div class="main_app">
    <el-switch v-model="isEnabled" @change="change"></el-switch>
    {{ isEnabled ? '开启' : '关闭' }}
  </div>
</template>

<script lang="ts">
import PopupMessage from '@CLib/message/popup'
import Storage from '@CLib/storage'
import { Component, Vue } from 'vue-property-decorator'

interface Live2DModel {
  name: string
  res: []
  enable: boolean
}

@Component
export default class MyApp extends Vue {
  isEnabled: boolean = true
  cfg: any = {}
  active: string = ''
  list: Live2DModel[] = []

  created() {
    PopupMessage.BACKGROUNDPAGE.getCfg((cfg: any) => {
      this.cfg = cfg || {
        date: new Date().getDate(),
        index: 0,
        isHide: false,
      }
      this.isEnabled = !this.cfg.isHide
    })
  }

  change(val) {
    PopupMessage.BACKGROUNDPAGE.setCfg(
      Object.assign({}, this.cfg, {
        date: new Date().getDate(),
        index: 0,
        isHide: !this.isEnabled,
        modelIndex: 0,
      })
    )
    // PopupMessage.sendMessage('popup.msg', `form popup's test`)
    // console.log('popup msg: ', PopupMessage.BACKGROUNDPAGE)
    // if (!PopupMessage.BACKGROUNDPAGE) return
  }
}
</script>

<style>
.main_app {
  width: 100px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.el-switch {
  margin-right: 10px;
}
</style>