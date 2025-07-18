import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

interface LoginCredentials {
  username: string
  password: string
}

interface User {
  id: number
  username: string
  email: string
}

export const login = async (credentials: LoginCredentials): Promise<User> => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials)
  return response.data.user
}

export const logout = async (): Promise<void> => {
  await axios.post(`${API_BASE_URL}/auth/logout`)
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/me`)
    return response.data.user
  } catch (error) {
    return null
  }
}
