<template>
  <div class="not-found">
    <div class="container">
      <div class="error-content">
        <div class="error-illustration">
          <div class="error-code">404</div>
          <div class="error-icon">🔍</div>
        </div>

        <div class="error-message">
          <h1>页面未找到</h1>
          <p>抱歉，您访问的页面不存在或已被移除。</p>
        </div>

        <div class="error-actions">
          <RouterLink to="/" class="home-btn">
            <span class="btn-icon">🏠</span>
            返回首页
          </RouterLink>

          <button @click="goBack" class="back-btn">
            <span class="btn-icon">⬅️</span>
            返回上页
          </button>
        </div>

        <div class="help-section">
          <h3>您可以尝试：</h3>
          <ul class="help-list">
            <li>检查网址是否输入正确</li>
            <li>
              <RouterLink to="/categories">浏览工具分类</RouterLink>
            </li>
            <li>使用搜索功能查找所需工具</li>
            <li>如果问题持续存在，请联系我们</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 2rem;
}

.error-content {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.error-illustration {
  position: relative;
  margin-bottom: 2rem;
}

.error-code {
  font-size: 8rem;
  font-weight: 900;
  color: #667eea;
  line-height: 1;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 3rem;
  opacity: 0.8;
}

.error-message {
  margin-bottom: 2rem;
}

.error-message h1 {
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.error-message p {
  color: #6c757d;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.home-btn,
.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1rem;
  cursor: pointer;
}

.home-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.home-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.back-btn {
  background: #f8f9fa;
  color: #495057;
  border: 2px solid #e9ecef;
}

.back-btn:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1.1rem;
}

.help-section {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 2rem;
  text-align: left;
}

.help-section h3 {
  color: #495057;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  text-align: center;
}

.help-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.help-list li {
  color: #6c757d;
  padding: 0.5rem 0;
  font-size: 1rem;
  line-height: 1.5;
  position: relative;
  padding-left: 2rem;
}

.help-list li::before {
  content: "•";
  color: #667eea;
  font-weight: bold;
  position: absolute;
  left: 0.5rem;
}

.help-list a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.help-list a:hover {
  color: #5a67d8;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .error-content {
    padding: 2rem;
  }

  .error-code {
    font-size: 6rem;
  }

  .error-message h1 {
    font-size: 1.5rem;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }

  .home-btn,
  .back-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .error-content {
    padding: 1.5rem;
  }

  .error-code {
    font-size: 4rem;
  }

  .error-message h1 {
    font-size: 1.3rem;
  }

  .error-message p {
    font-size: 1rem;
  }

  .help-section {
    padding: 1.5rem;
  }
}
</style>
