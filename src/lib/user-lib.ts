import {useUserStore} from '@/stores/user'

export function saveLoginState(token, username) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  // 3. 写入 cookie
  document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
  // 2. 设置 username
  document.cookie =
    `username=${username}` +
    `; expires=${expires.toUTCString()}` +
    `; path=/` +
    `; SameSite=Lax`;
  const userStore = useUserStore()
  userStore.setUser(token, username)
}


export function extractPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch {
    return null;
  }
}
