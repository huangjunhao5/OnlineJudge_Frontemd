// 读取 cookie
export function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? match[2] : ''
}

// 设置（或删除） cookie
export function setCookie(name, value, days = 0) {
  let expires
  if (days) {
    const d = new Date()
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000)
    expires = `; expires=${d.toUTCString()}`
  } else {
    // 立即删除
    expires = `; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/`
}
