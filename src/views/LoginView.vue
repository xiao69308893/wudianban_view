<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="login-background">
      <div class="bg-pattern"></div>
    </div>

    <!-- 登录表单区域 -->
    <div class="login-content">
      <!-- Logo和标题 -->
      <div class="login-header">
        <div class="logo">
          <img src="@/assets/logo.svg" alt="Logo" width="48" height="48" />
        </div>
        <h1>电气计算工具平台</h1>
        <p>专业的电气工程计算解决方案</p>
      </div>

      <!-- 登录表单卡片 -->
      <el-card class="login-card" shadow="always">
        <template #header>
          <div class="card-header">
            <el-icon size="20"><User /></el-icon>
            <span>用户登录</span>
          </div>
        </template>

        <!-- 登录表单 -->
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          label-position="top"
          size="large"
          @submit.prevent="handleLogin"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              :prefix-icon="User"
              clearable
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              show-password
              clearable
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <!-- 记住密码和忘记密码 -->
          <el-form-item>
            <div class="login-options">
              <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
              <el-link type="primary" :underline="false">忘记密码？</el-link>
            </div>
          </el-form-item>

          <!-- 登录按钮 -->
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              style="width: 100%"
              :loading="isLoading"
              @click="handleLogin"
            >
              {{ isLoading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>

          <!-- 分割线 -->
          <el-divider>
            <span style="color: #999; font-size: 14px;">或</span>
          </el-divider>

          <!-- 其他登录方式 -->
          <div class="social-login">
            <el-button class="social-btn" @click="handleWechatLogin">
              <el-icon size="18" color="#09bb07"><ChatDotRound /></el-icon>
              微信登录
            </el-button>
            <el-button class="social-btn" @click="handlePhoneLogin">
              <el-icon size="18" color="#1890ff"><Phone /></el-icon>
              手机登录
            </el-button>
          </div>

          <!-- 注册链接 -->
          <div class="register-link">
            <span>还没有账号？</span>
            <el-link type="primary" :underline="false" @click="goToRegister">
              立即注册
            </el-link>
          </div>
        </el-form>
      </el-card>

      <!-- 页面底部信息 -->
      <div class="login-footer">
        <el-link href="#" type="info" :underline="false">服务条款</el-link>
        <el-divider direction="vertical" />
        <el-link href="#" type="info" :underline="false">隐私政策</el-link>
        <el-divider direction="vertical" />
        <el-link href="#" type="info" :underline="false">帮助中心</el-link>
      </div>
    </div>

    <!-- 演示账号提示 -->
    <el-alert
      class="demo-alert"
      title="演示账号"
      type="info"
      :closable="false"
      show-icon
    >
      <p>用户名：admin 密码：123456</p>
      <p>用户名：demo 密码：demo123</p>
    </el-alert>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElForm } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { User, Lock, ChatDotRound, Phone } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 表单引用
const loginFormRef = ref<InstanceType<typeof ElForm>>()

// 加载状态
const isLoading = ref(false)
const rememberMe = ref(false)

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    // 表单验证
    await loginFormRef.value.validate()

    isLoading.value = true

    // 执行登录
    await userStore.login({
      username: loginForm.username,
      password: loginForm.password
    })

    // 记住密码逻辑
    if (rememberMe.value) {
      localStorage.setItem('rememberedUsername', loginForm.username)
    } else {
      localStorage.removeItem('rememberedUsername')
    }

    ElMessage.success('登录成功！')

    // 跳转到首页或之前的页面
    const redirect = router.currentRoute.value.query.redirect as string
    router.replace(redirect || '/')

  } catch (error: any) {
    console.error('登录失败:', error)
    ElMessage.error(error.message || '登录失败，请检查用户名和密码')
  } finally {
    isLoading.value = false
  }
}

// 微信登录
const handleWechatLogin = () => {
  ElMessage.info('微信登录功能开发中...')
}

// 手机登录
const handlePhoneLogin = () => {
  ElMessage.info('手机登录功能开发中...')
}

// 跳转到注册页面
const goToRegister = () => {
  ElMessage.info('注册功能开发中...')
}

// 页面初始化时检查记住的用户名
const initForm = () => {
  const rememberedUsername = localStorage.getItem('rememberedUsername')
  if (rememberedUsername) {
    loginForm.username = rememberedUsername
    rememberMe.value = true
  }
}

// 初始化
initForm()
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.login-content {
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 1;
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
  color: white;
}

.logo {
  margin-bottom: 16px;
}

.login-header h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-header p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.login-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.social-login {
  display: flex;
  gap: 12px;
}

.social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #dcdfe6;
  background: white;
  color: #606266;
}

.social-btn:hover {
  border-color: #409eff;
  color: #409eff;
  background: #f5f7fa;
}

.register-link {
  text-align: center;
  margin-top: 16px;
  color: #666;
  font-size: 14px;
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  padding: 16px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.demo-alert {
  position: fixed;
  top: 20px;
  right: 20px;
  max-width: 300px;
  z-index: 1000;
}

/* 表单项样式优化 */
:deep(.el-form-item__label) {
  color: #303133;
  font-weight: 500;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #409eff, #6cb2ff);
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transition: all 0.3s;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #66b1ff, #409eff);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    padding: 12px;
  }

  .login-content {
    max-width: 100%;
  }

  .login-header h1 {
    font-size: 24px;
  }

  .login-header p {
    font-size: 14px;
  }

  .demo-alert {
    position: relative;
    top: auto;
    right: auto;
    margin-bottom: 20px;
    max-width: 100%;
  }

  .social-login {
    flex-direction: column;
  }

  .social-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 8px;
  }

  .login-header {
    margin-bottom: 16px;
  }

  .login-header h1 {
    font-size: 20px;
  }

  .card-header {
    font-size: 16px;
  }

  .login-options {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}

/* 动画效果 */
.login-card {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  animation: fadeIn 0.8s ease-out 0.2s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
