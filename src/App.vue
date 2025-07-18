<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()

onMounted(() => {
  userStore.checkAuth()
})
</script>

<template>
  <div id="app">
    <nav class="main-nav">
      <div class="nav-container">
        <RouterLink to="/" class="logo">
          <span class="logo-icon">⚡</span>
          <span class="logo-text">电气计算工具</span>
        </RouterLink>

        <div class="nav-links">
          <RouterLink to="/categories" class="nav-link">工具分类</RouterLink>
          <RouterLink to="/about" class="nav-link">关于</RouterLink>

          <div class="user-section">
            <template v-if="userStore.isAuthenticated">
              <span class="user-name">{{ userStore.user?.username }}</span>
              <button @click="userStore.logout()" class="logout-btn">退出</button>
            </template>
            <template v-else>
              <RouterLink to="/login" class="login-btn">登录</RouterLink>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <RouterView />
    </main>

    <footer class="main-footer">
      <div class="footer-container">
        <p>&copy; 2025 电气计算工具平台. 版权所有.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 导航栏样式 */
.main-nav {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
}

.logo-icon {
  font-size: 2rem;
  margin-right: 0.5rem;
}

.logo-text {
  font-weight: 600;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  color: white;
  font-weight: 500;
}

.login-btn,
.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn:hover,
.logout-btn:hover {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
}

/* 主内容区域 */
.main-content {
  flex: 1;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 140px);
}

/* 页脚样式 */
.main-footer {
  background: #2c3e50;
  color: white;
  padding: 1rem 0;
  text-align: center;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
    flex-direction: column;
    height: auto;
    padding: 1rem;
  }

  .nav-links {
    margin-top: 1rem;
    gap: 1rem;
  }

  .logo {
    font-size: 1.2rem;
  }

  .nav-link {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
}
</style>
