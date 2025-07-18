<template>
  <div class="category-view">
    <!-- 头部横幅 -->
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
      <div class="search-container">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索计算工具..."
            class="search-input"
            @input="handleSearch"
          >
          <button class="search-btn">
            <span class="search-icon">🔍</span>
          </button>
        </div>
      </div>
    </section>

    <!-- 工具分类 -->
    <section class="categories-section">
      <div class="container">
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
    <section class="recent-tools" v-if="recentTools.length > 0">
      <div class="container">
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
    </section>

    <!-- 功能特色 -->
    <section class="features-section">
      <div class="container">
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
            <p>模块化设计，方便添加新的计算工具</p>
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
.category-view {
  width: 100%;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 头部横幅 */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.8;
}

/* 搜索区域 */
.search-section {
  padding: 2rem 0;
  background: white;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 2rem;
}

.search-box {
  display: flex;
  border-radius: 50px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background: white;
}

.search-input {
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  font-size: 1.1rem;
  outline: none;
}

.search-btn {
  padding: 1rem 2rem;
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
  font-size: 1.2rem;
}

/* 分类网格 */
.categories-section {
  padding: 4rem 0;
  background: #f8f9fa;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #2c3e50;
  font-weight: 600;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.category-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.category-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.category-icon {
  font-size: 3rem;
  margin-right: 1rem;
}

.category-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.category-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.category-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tool-count {
  color: #667eea;
  font-weight: 500;
}

.arrow {
  font-size: 1.5rem;
  color: #667eea;
  transition: transform 0.3s ease;
}

.category-card:hover .arrow {
  transform: translateX(5px);
}

/* 最近使用 */
.recent-tools {
  padding: 4rem 0;
  background: white;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.tool-card {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  text-align: center;
}

.tool-card:hover {
  background: #667eea;
  color: white;
  transform: translateY(-5px);
}

.tool-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.tool-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.tool-desc {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* 功能特色 */
.features-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .hero-stats {
    flex-direction: column;
    gap: 1.5rem;
  }

  .category-grid {
    grid-template-columns: 1fr;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 2rem;
  }

  .container {
    padding: 0 1rem;
  }
}
</style>
