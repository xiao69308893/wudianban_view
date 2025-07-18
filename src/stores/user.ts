import { defineStore } from 'pinia'
import { login, logout, getCurrentUser } from '@/api/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    isAuthenticated: false,
    user: null as any | null,
  }),
  actions: {
    async login(credentials: { username: string; password: string }) {
      try {
        this.user = await login(credentials)
        this.isAuthenticated = true
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    },
    async logout() {
      try {
        await logout()
        this.isAuthenticated = false
        this.user = null
      } catch (error) {
        console.error('Logout failed:', error)
      }
    },
    async checkAuth() {
      try {
        this.user = await getCurrentUser()
        this.isAuthenticated = true
      } catch (error) {
        this.isAuthenticated = false
        this.user = null
      }
    },
  },
})
