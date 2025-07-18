<template>
  <div class="login-view">
    <h1>用户登录</h1>
    <form @submit.prevent="submitLogin">
      <div class="form-group">
        <label for="username">用户名</label>
        <input type="text" id="username" v-model="credentials.username" required />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input type="password" id="password" v-model="credentials.password" required />
      </div>
      <button type="submit">登录</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()

const credentials = ref({
  username: '',
  password: '',
})

const error = ref('')

const submitLogin = async () => {
  try {
    await userStore.login(credentials.value)
    router.push('/')
  } catch (err) {
    error.value = '登录失败，请检查用户名和密码'
  }
}
</script>

<style scoped>
.login-view {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.error {
  color: #ff5252;
  margin-top: 1rem;
}
</style>
