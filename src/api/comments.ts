import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

interface Comment {
  id: number
  content: string
  userId: number
  userName: string
  toolId: number
  timestamp: string
}

export const fetchComments = async (toolId: number): Promise<Comment[]> => {
  const response = await axios.get(`${API_BASE_URL}/comments?toolId=${toolId}`)
  return response.data
}

export const postComment = async (data: { toolId: number; content: string }): Promise<Comment> => {
  const response = await axios.post(`${API_BASE_URL}/comments`, data)
  return response.data
}
