<template>
  <div class="category-view">
    <!-- 头部横幅 - 全宽显示 -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">电气计算工具平台</h1>
        <p class="hero-subtitle">专业的电气工程计算工具集合，助力工程师高效工作</p>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">{{ totalTools }}</span>
            <span class="stat-label">计算工具</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ categories.length }}</span>
            <span class="stat-label">工具分类</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">1000+</span>
            <span class="stat-label">用户使用</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 快速搜索 -->
    <section class="search-section">
      <div class="content-wrapper">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索计算工具..."
            class="search-input"
            @input="handleSearch"
          />
          <button class="search-btn">
            <span class="search-icon">🔍</span>
          </button>
        </div>
      </div>
    </section>

    <!-- 工具分类 -->
    <section class="categories-section">
      <div class="content-wrapper">
        <h2 class="section-title">工具分类</h2>
        <div class="category-grid">
          <RouterLink
            v-for="category in filteredCategories"
            :key="category.id"
            :to="`/category/${category.id}`"
            class="category-card"
          >
            <div class="card-header">
              <span class="category-icon">{{ category.icon }}</span>
              <h3 class="category-name">{{ category.name }}</h3>
            </div>
            <p class="category-description">{{ category.description }}</p>
            <div class="category-footer">
              <span class="tool-count">{{ category.toolCount }} 个工具</span>
              <span class="arrow">→</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- 最近使用的工具 -->
<!--    <section class="recent-tools" v-if="recentTools.length > 0">
      <div class="content-wrapper">
        <h2 class="section-title">最近使用</h2>
        <div class="tools-grid">
          <RouterLink
            v-for="tool in recentTools"
            :key="tool.id"
            :to="`/category/${tool.categoryId}/tool/${tool.id}`"
            class="tool-card"
          >
            <div class="tool-icon">{{ tool.icon }}</div>
            <h4 class="tool-name">{{ tool.name }}</h4>
            <p class="tool-desc">{{ tool.description }}</p>
          </RouterLink>
        </div>
      </div>
    </section>-->

    <!-- 功能特色 -->
    <section class="features-section">
      <div class="content-wrapper">
        <h2 class="section-title">平台特色</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>快速计算</h3>
            <p>即时获得准确的计算结果，提升工作效率</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>专业准确</h3>
            <p>基于标准电气公式，确保计算结果的准确性</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>响应式设计</h3>
            <p>支持PC、平板、手机等多种设备访问</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔧</div>
            <h3>易于扩展</h3>
            <p>模块化设计，工具链任意组合</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 分类数据
const categories = ref([
  {
    id: 1,
    name: '常用计算',
    icon: '⚡',
    description: '电压、电流、功率等基础电气参数计算',
    toolCount: 8
  },
  {
    id: 2,
    name: '负荷计算',
    icon: '📊',
    description: '设备负荷、用电量、需用系数等计算',
    toolCount: 6
  },
  {
    id: 3,
    name: '短路计算',
    icon: '⚠️',
    description: '短路电流、保护设备选择等安全计算',
    toolCount: 4
  },
  {
    id: 4,
    name: '电压降计算',
    icon: '📉',
    description: '线路电压降、补偿计算等配电计算',
    toolCount: 5
  },
  {
    id: 5,
    name: '电缆选择',
    icon: '🔌',
    description: '电缆截面、载流量、选型等计算',
    toolCount: 7
  },
  {
    id: 6,
    name: '照明计算',
    icon: '💡',
    description: '照度计算、灯具布置、节能分析',
    toolCount: 3
  }
])

// 搜索功能
const searchQuery = ref('')
const recentTools = ref([
  { id: 1, name: '三相功率计算', icon: '⚡', description: '三相交流电路功率计算', categoryId: 1 },
  { id: 2, name: '电缆载流量', icon: '🔌', description: '电缆载流量计算', categoryId: 5 }
])

// 计算总工具数
const totalTools = computed(() => {
  return categories.value.reduce((sum, cat) => sum + cat.toolCount, 0)
})

// 搜索过滤
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value
  return categories.value.filter(cat =>
    cat.name.includes(searchQuery.value) ||
    cat.description.includes(searchQuery.value)
  )
})

// 搜索处理
const handleSearch = () => {
  // 这里可以添加搜索逻辑
  console.log('搜索:', searchQuery.value)
}

onMounted(() => {
  // 组件挂载时的初始化逻辑
})
</script>

<style scoped>
/* 主容器 - 全屏显示 */
.category-view {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
}

/* 内容包装器 - 限制最大宽度但保持响应式 */
.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 头部横幅 - 全宽背景 */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 0 20px;
  text-align: center;
  width: 100%;
}

.hero-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.4rem;
  margin-bottom: 4rem;
  opacity: 0.95;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 4rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: block;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* 搜索区域 */
.search-section {
  padding: 40px 0;
  background: white;
  border-bottom: 1px solid #e8e8e8;
}

.search-box {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  border-radius: 50px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background: white;
  border: 2px solid #f0f0f0;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  border-color: #667eea;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
}

.search-input {
  flex: 1;
  padding: 18px 24px;
  border: none;
  font-size: 1.1rem;
  outline: none;
  background: transparent;
}

.search-input::placeholder {
  color: #adb5bd;
}

.search-btn {
  padding: 18px 24px;
  background: #667eea;
  color: white;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;
}

.search-btn:hover {
  background: #5a67d8;
}

.search-icon {
  font-size: 1.3rem;
}

/* 分类网格 */
.categories-section {
  padding: 60px 0;
  background: white;
}

.section-title {
  text-align: center;
  font-size: 2.8rem;
  margin-bottom: 4rem;
  color: #2c3e50;
  font-weight: 600;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 2.5rem;
}

.category-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.category-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.category-card:hover::before {
  transform: scaleX(1);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.category-icon {
  font-size: 3.5rem;
  margin-right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 15px;
}

.category-name {
  font-size: 1.6rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.category-description {
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 2rem;
  font-size: 1.05rem;
}

.category-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tool-count {
  color: #667eea;
  font-weight: 600;
  font-size: 0.95rem;
}

.arrow {
  font-size: 1.8rem;
  color: #667eea;
  transition: transform 0.3s ease;
}

.category-card:hover .arrow {
  transform: translateX(8px);
}

/* 最近使用 */
.recent-tools {
  padding: 60px 0;
  background: #f8f9fa;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.tool-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.tool-card:hover {
  background: #667eea;
  color: white;
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.3);
}

.tool-icon {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  display: block;
}

.tool-name {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.tool-desc {
  font-size: 0.95rem;
  opacity: 0.8;
  line-height: 1.5;
}

/* 功能特色 */
.features-section {
  padding: 60px 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
}

.feature-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  display: block;
}

.feature-card h3 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #2c3e50;
  font-weight: 600;
}

.feature-card p {
  color: #6c757d;
  line-height: 1.6;
  font-size: 1rem;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .content-wrapper {
    padding: 0 20px;
  }

  .hero-content {
    padding: 0 20px;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 0 16px;
  }

  .hero-content {
    padding: 0 16px;
  }

  .hero-section {
    padding: 60px 0 40px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
    margin-bottom: 3rem;
  }

  .hero-stats {
    flex-direction: column;
    gap: 2rem;
  }

  .stat-number {
    font-size: 2.5rem;
  }

  .category-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .category-card {
    padding: 2rem;
  }

  .category-icon {
    font-size: 3rem;
    width: 60px;
    height: 60px;
  }

  .category-name {
    font-size: 1.4rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .tools-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 2.2rem;
    margin-bottom: 3rem;
  }

  .search-section {
    padding: 30px 0;
  }

  .search-box {
    margin: 0 16px;
  }

  .search-input {
    padding: 16px 20px;
    font-size: 1rem;
  }

  .search-btn {
    padding: 16px 20px;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 0 12px;
  }

  .hero-content {
    padding: 0 12px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .stat-number {
    font-size: 2rem;
  }

  .category-card {
    padding: 1.5rem;
  }

  .card-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .category-icon {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .search-box {
    margin: 0 12px;
    flex-direction: column;
    border-radius: 15px;
  }

  .search-input {
    border-bottom: 1px solid #e8e8e8;
    border-radius: 0;
  }

  .search-btn {
    border-radius: 0 0 15px 15px;
  }
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.category-card,
.feature-card,
.tool-card {
  animation: fadeInUp 0.6s ease-out;
}

/* 为不同的卡片添加延迟动画 */
.category-card:nth-child(1) { animation-delay: 0.1s; }
.category-card:nth-child(2) { animation-delay: 0.2s; }
.category-card:nth-child(3) { animation-delay: 0.3s; }
.category-card:nth-child(4) { animation-delay: 0.4s; }
.category-card:nth-child(5) { animation-delay: 0.5s; }
.category-card:nth-child(6) { animation-delay: 0.6s; }

/* 滚动显示动画 */
@media (prefers-reduced-motion: no-preference) {
  .category-view {
    scroll-behavior: smooth;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .category-card {
    border: 2px solid #333;
  }

  .hero-section {
    background: #333;
  }

  .search-box {
    border: 2px solid #333;
  }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .category-view {
    background: #1a1a1a;
    color: #ffffff;
  }

  .categories-section,
  .search-section {
    background: #2d2d2d;
  }

  .category-card,
  .feature-card,
  .tool-card {
    background: #333333;
    color: #ffffff;
  }

  .section-title {
    color: #ffffff;
  }
}
</style>
