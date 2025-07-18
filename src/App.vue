<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 控制移动端菜单展开/收起
const isMenuCollapsed = ref(false)

// 导航菜单项
const menuItems = [
  { index: '/', title: '首页', icon: 'House' },
  { index: '/categories', title: '计算工具', icon: 'Calculator' },
  { index: '/about', title: '关于', icon: 'InfoFilled' }
]

// 处理菜单选择
const handleMenuSelect = (key: string) => {
  router.push(key)
  // 移动端选择后收起菜单
  if (window.innerWidth < 768) {
    isMenuCollapsed.value = true
  }
}

// 退出登录
const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <!-- 响应式布局容器 -->
  <el-container class="app-container">
    <!-- 侧边栏 - 桌面端显示，移动端可折叠 -->
    <el-aside
      :width="isMenuCollapsed ? '64px' : '200px'"
      class="app-sidebar"
      :class="{ 'mobile-hidden': isMenuCollapsed }"
    >
      <!-- Logo区域 -->
      <div class="logo-container">
        <img alt="Logo" src="@/assets/logo.svg" width="32" height="32" />
        <span v-show="!isMenuCollapsed" class="logo-text">电气计算</span>
      </div>

      <!-- 导航菜单 -->
      <el-menu
        :default-active="$route.path"
        :collapse="isMenuCollapsed"
        @select="handleMenuSelect"
        class="app-menu"
      >
        <el-menu-item
          v-for="item in menuItems"
          :key="item.index"
          :index="item.index"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <template #title>{{ item.title }}</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主体区域 -->
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="app-header">
        <div class="header-left">
          <!-- 移动端菜单切换按钮 -->
          <el-button
            class="mobile-menu-btn"
            :icon="isMenuCollapsed ? 'Expand' : 'Fold'"
            @click="isMenuCollapsed = !isMenuCollapsed"
            text
          />

          <!-- 面包屑导航 -->
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="$route.name === 'category'">
              {{ $route.params.categoryId }}
            </el-breadcrumb-item>
            <el-breadcrumb-item v-if="$route.name === 'tool'">
              工具详情
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <!-- 用户信息 -->
          <el-dropdown v-if="userStore.isAuthenticated" @command="handleLogout">
            <span class="user-info">
              {{ userStore.user?.username }}
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- 未登录状态 -->
          <el-button v-else @click="router.push('/login')" type="primary">
            登录
          </el-button>
        </div>
      </el-header>

      <!-- 主要内容区域 -->
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.app-container {
  height: 100vh;
}

.app-sidebar {
  background: #001529;
  transition: width 0.3s;
  overflow: hidden;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  color: white;
  border-bottom: 1px solid #1e3a8a;
}

.logo-text {
  margin-left: 12px;
  font-weight: 600;
  font-size: 16px;
}

.app-menu {
  border-right: none;
  background: #001529;
}

.app-menu :deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.8);
}

.app-menu :deep(.el-menu-item:hover),
.app-menu :deep(.el-menu-item.is-active) {
  background: #1890ff;
  color: white;
}

.app-header {
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
}

.mobile-menu-btn {
  margin-right: 16px;
}

.breadcrumb {
  display: none;
}

.user-info {
  cursor: pointer;
  color: #666;
}

.app-main {
  background: #f5f5f5;
  min-height: calc(100vh - 60px);
  padding: 16px;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .mobile-menu-btn {
    display: none;
  }

  .breadcrumb {
    display: block;
  }

  .app-sidebar {
    position: relative;
  }
}

@media (max-width: 767px) {
  .app-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
    transform: translateX(0);
    transition: transform 0.3s;
  }

  .app-sidebar.mobile-hidden {
    transform: translateX(-100%);
  }

  .app-main {
    padding: 12px;
  }

  .logo-text {
    display: none;
  }
}
</style>
