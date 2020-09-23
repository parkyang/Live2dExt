interface CookieOptions {
  [expires: string]: null | object | number | string
}
export class Cookies {
  constructor(
    name: string,
    value: any,
    options: CookieOptions = {
      expires: null,
    }
  ) {
    if (value) {
      // 写入cookie
      Cookies.setCookie(name, value, options)
    } else {
      // 获取cookie
      Cookies.getCookie(name)
    }
  }

  /**
   * get cookie
   * @param name{string} cookie's name
   */
  static getCookie(name: string) {
    name = name + '='
    let decodedCookie = ''
    try {
      decodedCookie = decodeURIComponent(document.cookie)
    } catch (e) {}
    const ca = decodedCookie.split(';')
    for (const i of ca) {
      let c: string = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name.toString()) === 0) {
        return c.substring(name.length, c.length)
      }
    }
    return ''
  }

  /**
   * set cookie
   * @param name{string} cookie's name
   * @param value{any} 值
   * @param options{CookieOptions} 相关设置参数
   */
  static setCookie(
    name: string,
    value: any,
    options: CookieOptions = {
      expires: null,
    }
  ) {
    // 写入
    const Days = 30
    const exp: any = new Date()
    const optStr: string[] = []
    if (typeof options.expires === 'number') {
      exp.setDate(exp.getDate() + options.expires)
      options.expires = exp.toGMTString()
    } else if (options.expires === null) {
      exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
      optStr.push(`expires=${exp.toGMTString()}`)
    }
    Object.keys(options).map((key: string) => {
      optStr.push(`${key}=${options[key]}`)
    })
    document.cookie = name + '=' + escape(value) + ';' + optStr.join(';')
  }

  /**
   * remove cookie
   * @param name {string} cookie's name
   */
  static remove(name: string) {
    Cookies.setCookie(name, null, {
      expires: -1,
    })
  }
}
export default Cookies
