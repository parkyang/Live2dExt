interface Live2DModel {
  name: string
  res: []
  enable: boolean
  width: string
  height: string
  style: string
}
declare interface Window {
  Live2DExt: any
  loadlive2d: any
}

const w: any = window
const utils = {
  isObject(val: any) {
    return (
      val !== null && typeof val === 'object' && Array.isArray(val) === false
    )
  },
  // 设置cookie
  setCookie(key: string, value: any, option: any) {
    let str: string = key + '=' + encodeURIComponent(value)
    if (option && this.isObject(option)) {
      if (!('path' in option)) {
        option.path = '/'
      }
      Object.keys(option).map((key: string) => {
        if (key === 'expires') {
          const date: Date = new Date()
          // 把过期日期设置为option.expires天之后
          date.setDate(date.getDate() + option.expires)
          str += `;${key}=` + date
        } else {
          str += `;${key}=` + option[key]
        }
      })
    }
    document.cookie = str
  },

  // 获取cookie
  getCookie(name: string) {
    name = name + '='
    let decodedCookie = ''
    try {
      decodedCookie = decodeURIComponent(document.cookie)
    } catch (err) {}
    const ca: string[] = decodedCookie.split(';')
    for (const i of ca) {
      let c: string = i
      while (c.charAt(0) === ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length)
      }
    }
    return ''
  },

  setCifg(index: number, isHide = false) {
    window.dispatchEvent(
      new CustomEvent('Live2DExt.change', {
        detail: {
          date: new Date().getDate(),
          index,
          isHide,
        },
      } as CustomEventInit)
    )
  },
  setStyle(dom: any, val: string) {
    val.split(';').map((v: string) => {
      const kv: string[] = v
        .split(':')
        .map((i) => i.replace(/(^\s+)|(\s+$)/, ''))
      dom.style[kv[0]] = kv[1]
    })
  },
}
const resolvePath = (j: string, p: string): string => {
  return /^(https*:)*\/\//i.test(p) ? p : `${j}${p}`
}
w.addEventListener('Live2DExt.init', (e: Event) => {
  const ModelCfg: any = window.Live2DExt && window.Live2DExt.models
  if (
    !ModelCfg ||
    !ModelCfg.models ||
    !ModelCfg.models.length ||
    !ModelCfg.models.map
  ) {
    console.error('Live2DExt Error', ModelCfg)
    throw new Error('Live2DExt Error: 数据为空或格式有误')
  }
  const cfg: any = {
    date: new Date().getDate(),
    index: 0,
    isHide: false,
  }
  const detail = (e as CustomEvent).detail
  const canvas = document.createElement('canvas')
  const jsPath = (detail && detail.path) || ''
  const model: Live2DModel = (ModelCfg.models.filter(
    (item: Live2DModel, _index: number) => {
      return item.enable
    }
  )[0] || ModelCfg.models[0]) as Live2DModel
  let index = detail && detail.index
  if (!detail || detail.isHide || !jsPath) {
    return
  }
  if (!('date' in detail) || !model.res[index]) {
    index = 0
  } else if (detail.date !== cfg.date) {
    index = index < model.res.length ? index++ : 0
  }
  canvas.id = 'live2d_ext_' + new Date().getTime()
  canvas.setAttribute('width', detail.width || '100')
  canvas.setAttribute('height', detail.height || '210')
  utils.setStyle(
    canvas,
    detail.style || 'position: fixed; z-index: 9999999999; right: 0; bottom: 0;'
  )
  canvas.addEventListener('click', (e: MouseEvent) => {
    if (e.ctrlKey) {
      document.body.removeChild(canvas)
    } else {
      window.loadlive2d(
        canvas.id,
        resolvePath(
          jsPath,
          model.res[++index >= model.res.length ? (index = 0) : index]
        )
      )
    }
    utils.setCifg(index, e.ctrlKey)
  })
  if (window.loadlive2d) {
    if (!document.body) {
      document.addEventListener('readystatechange', () => {
        if (document.readyState === 'interactive') {
          document.body.appendChild(canvas)
          window.loadlive2d(canvas.id, resolvePath(jsPath, model.res[index]))
        }
      })
    } else {
      document.body.appendChild(canvas)
      window.loadlive2d(canvas.id, resolvePath(jsPath, model.res[index]))
    }
  }
})
