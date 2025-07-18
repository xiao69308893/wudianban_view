<template>
  <div class="comment-section">
    <h3>用户反馈</h3>

    <div v-if="userStore.isAuthenticated">
      <textarea v-model="newComment" placeholder="请输入您的反馈意见" rows="3"></textarea>
      <button @click="submitComment">提交</button>
    </div>
    <div v-else>
      <p>登录后即可留言 <button @click="login">登录</button></p>
    </div>

    <div class="comments-list">
      <div v-for="comment in comments" :key="comment.id" class="comment">
        <p>
          <strong>{{ comment.userName }}</strong> - {{ formatDate(comment.timestamp) }}
        </p>
        <p>{{ comment.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { fetchComments, postComment } from '@/api/comments'

const props = defineProps<{
  toolId: number
}>()

const userStore = useUserStore()
const comments = ref<any[]>([])
const newComment = ref('')

onMounted(async () => {
  try {
    comments.value = await fetchComments(props.toolId)
  } catch (error) {
    console.error('Failed to fetch comments:', error)
  }
})

const submitComment = async () => {
  if (!newComment.value.trim()) return

  try {
    const comment = await postComment({
      toolId: props.toolId,
      content: newComment.value,
    })

    comments.value.unshift(comment)
    newComment.value = ''
  } catch (error) {
    console.error('Failed to post comment:', error)
  }
}

const login = () => {
  // 实现登录逻辑
  userStore.login()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}
</script>

<style scoped>
.comment-section {
  margin-top: 2rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
}

textarea {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.comments-list {
  margin-top: 1rem;
}

.comment {
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}
</style>
