// stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    username: ''
  }),
  actions: {
    setUser(token, username) {
      this.token = token
      this.username = username
    },
    clearUser() {
      this.token = ''
      this.username = ''
    }
  }
})
