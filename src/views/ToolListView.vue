<template>
  <div class="tool-list-view">
    <!-- 页面头部 - 统一风格 -->
    <section class="page-header-section">
      <div class="content-wrapper">
        <div class="header-content">
          <button @click="goBack" class="back-button">
            <span class="back-icon">←</span>
            返回
          </button>

          <div class="header-info">
            <div class="category-display">
              <span class="category-icon">{{ categoryInfo.icon }}</span>
              <div class="category-text">
                <h1 class="category-title">{{ categoryInfo.name }}</h1>
                <p class="category-description">{{ categoryInfo.description }}</p>
              </div>
            </div>
            <div class="category-stats">
              <span class="tool-count">{{ tools.length }} 个工具</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 搜索和过滤区域 -->
    <section class="filter-section">
      <div class="content-wrapper">
        <div class="filter-controls">
          <div class="search-box">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索工具..."
              class="search-input"
            />
            <span class="search-icon">🔍</span>
          </div>

          <div class="filter-controls-right">
            <select v-model="sortBy" class="sort-select">
              <option value="default">默认排序</option>
              <option value="name">按名称</option>
              <option value="popular">最常用</option>
              <option value="newest">最新</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- 工具网格 - 统一风格 -->
    <section class="tools-section">
      <div class="content-wrapper">
        <div class="tools-grid">
          <div
            v-for="tool in filteredTools"
            :key="tool.id"
            class="tool-card"
            @click="goToTool(tool.id)"
          >
            <!-- 工具图标和状态标签 -->
            <div class="tool-header">
              <div class="tool-icon">{{ tool.icon }}</div>
              <div class="tool-badges">
                <span v-if="tool.isNew" class="badge new-badge">NEW</span>
                <span v-if="tool.isPopular" class="badge popular-badge">热门</span>
              </div>
            </div>

            <!-- 工具信息 -->
            <div class="tool-info">
              <h3 class="tool-name">{{ tool.name }}</h3>
              <p class="tool-description">{{ tool.description }}</p>

              <!-- 工具特性标签 -->
              <div class="tool-features">
                <span
                  v-for="feature in tool.features"
                  :key="feature"
                  class="feature-tag"
                >
                  {{ feature }}
                </span>
              </div>
            </div>

            <!-- 工具统计 -->
            <div class="tool-stats">
              <div class="stat-item">
                <span class="stat-icon">👁️</span>
                <span class="stat-value">{{ tool.viewCount }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-icon">⭐</span>
                <span class="stat-value">{{ tool.rating }}</span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="tool-actions">
              <button class="primary-btn" @click.stop="goToTool(tool.id)">
                <span class="btn-icon">🚀</span>
                使用工具
              </button>
              <button
                class="secondary-btn"
                @click.stop="toggleFavorite(tool)"
                :class="{ 'favorited': tool.isFavorite }"
              >
                <span class="btn-icon">{{ tool.isFavorite ? '❤️' : '🤍' }}</span>
                {{ tool.isFavorite ? '已收藏' : '收藏' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredTools.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3 class="empty-title">没有找到相关工具</h3>
          <p class="empty-description">试试调整搜索条件或选择其他分类</p>
          <button @click="clearSearch" class="primary-btn">
            清除搜索条件
          </button>
        </div>
      </div>
    </section>

    <!-- 分页器 -->
    <section class="pagination-section" v-if="totalTools > pageSize">
      <div class="content-wrapper">
        <div class="pagination-container">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="page-btn"
          >
            上一页
          </button>

          <div class="page-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              class="page-btn"
              :class="{ 'active': page === currentPage }"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="page-btn"
          >
            下一页
          </button>
        </div>

        <div class="pagination-info">
          共 {{ totalTools }} 个工具，第 {{ currentPage }} / {{ totalPages }} 页
        </div>
      </div>
    </section>

    <!-- 回到顶部 -->
    <button
      v-show="showBackToTop"
      @click="scrollToTop"
      class="back-to-top"
    >
      <span class="back-to-top-icon">↑</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 路由参数
const categoryId = computed(() => parseInt(route.params.categoryId as string))

// 搜索和排序状态
const searchKeyword = ref('')
const sortBy = ref('default')
const currentPage = ref(1)
const pageSize = ref(12)
const showBackToTop = ref(false)

// 分类信息映射
const categoryInfoMap: Record<number, any> = {
  1: {
    name: '常用计算',
    description: '基础电气参数计算工具',
    icon: '⚡'
  },
  2: {
    name: '负荷计算',
    description: '电气负荷需求系数计算',
    icon: '📊'
  },
  3: {
    name: '短路计算',
    description: '短路电流及保护配置',
    icon: '⚠️'
  },
  4: {
    name: '电压降计算',
    description: '线路电压降损失计算',
    icon: '📉'
  },
  5: {
    name: '电缆选择',
    description: '电缆截面及型号选择',
    icon: '🔌'
  },
  6: {
    name: '照明计算',
    description: '照明设计计算工具',
    icon: '💡'
  }
}

// 当前分类信息
const categoryInfo = computed(() =>
    categoryInfoMap[categoryId.value] || {
      name: '未知分类',
      description: '',
      icon: '🔧'
    }
)

// 模拟工具数据
const allTools = ref([
  {
    id: 1,
    name: '三相交流功率计算',
    description: '计算三相交流电路的有功功率、无功功率和视在功率',
    icon: '⚡',
    categoryId: 1,
    features: ['实时计算', '详细过程', '结果导出'],
    viewCount: 1520,
    rating: 4.8,
    isNew: false,
    isPopular: true,
    isFavorite: false
  },
  {
    id: 2,
    name: '单相交流功率计算',
    description: '单相交流电路参数计算工具',
    icon: '🔌',
    categoryId: 1,
    features: ['简单易用', '公式显示'],
    viewCount: 980,
    rating: 4.6,
    isNew: true,
    isPopular: false,
    isFavorite: true
  },
  {
    id: 3,
    name: '电阻计算器',
    description: '根据电阻值计算电压、电流关系',
    icon: '🔧',
    categoryId: 1,
    features: ['欧姆定律', '功率计算'],
    viewCount: 756,
    rating: 4.5,
    isNew: false,
    isPopular: false,
    isFavorite: false
  },
  {
    id: 4,
    name: '电容计算器',
    description: '电容器容量和无功功率补偿计算',
    icon: '🔋',
    categoryId: 1,
    features: ['容量计算', '补偿分析'],
    viewCount: 643,
    rating: 4.4,
    isNew: false,
    isPopular: false,
    isFavorite: false
  },
  // 为其他分类添加示例工具
  {
    id: 5,
    name: '设备负荷计算',
    description: '计算各种电气设备的负荷需求',
    icon: '📊',
    categoryId: 2,
    features: ['多设备支持', '负荷分析'],
    viewCount: 890,
    rating: 4.7,
    isNew: false,
    isPopular: true,
    isFavorite: false
  },
  {
    id: 6,
    name: '短路电流计算',
    description: '计算短路故障时的电流大小',
    icon: '⚠️',
    categoryId: 3,
    features: ['安全分析', '保护配置'],
    viewCount: 567,
    rating: 4.6,
    isNew: true,
    isPopular: false,
    isFavorite: false
  }
])

// 当前分类的工具
const categoryTools = computed(() =>
  allTools.value.filter(tool => tool.categoryId === categoryId.value)
)

// 过滤和排序后的工具
const filteredTools = computed(() => {
  let filtered = categoryTools.value

  // 搜索过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(tool =>
      tool.name.toLowerCase().includes(keyword) ||
      tool.description.toLowerCase().includes(keyword)
    )
  }

  // 排序
  switch (sortBy.value) {
    case 'name':
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'popular':
      filtered = [...filtered].sort((a, b) => b.viewCount - a.viewCount)
      break
    case 'newest':
      filtered = [...filtered].sort((a, b) => Number(b.isNew) - Number(a.isNew))
      break
    default:
      // 默认排序：热门 > 新工具 > 浏览量
      filtered = [...filtered].sort((a, b) => {
        if (a.isPopular !== b.isPopular) return Number(b.isPopular) - Number(a.isPopular)
        if (a.isNew !== b.isNew) return Number(b.isNew) - Number(a.isNew)
        return b.viewCount - a.viewCount
      })
  }

  return filtered
})

// 分页相关
const totalTools = computed(() => filteredTools.value.length)
const totalPages = computed(() => Math.ceil(totalTools.value / pageSize.value))

const tools = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredTools.value.slice(start, end)
})

// 可见页码
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// 页面方法
const goBack = () => {
  router.push('/categories')
}

const goToTool = (toolId: number) => {
  router.push({
    path: `/category/${categoryId.value}/tool/${toolId}`
  })
}

const toggleFavorite = (tool: any) => {
  tool.isFavorite = !tool.isFavorite
  // 这里可以添加收藏到后端的逻辑
}

const clearSearch = () => {
  searchKeyword.value = ''
  sortBy.value = 'default'
  currentPage.value = 1
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    scrollToTop()
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 滚动监听
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 500
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* 主容器 - 全屏显示，统一风格 */
.tool-list-view {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
}

/* 内容包装器 */
.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 页面头部 - 统一风格 */
.page-header-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 0;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-4px);
}

.back-icon {
  font-size: 1.2rem;
}

.header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-display {
  display: flex;
  align-items: center;
  gap: 20px;
}

.category-icon {
  font-size: 4rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
}

.category-text {
  flex: 1;
}

.category-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.category-description {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
}

.category-stats {
  text-align: right;
}

.tool-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
}

/* 搜索和过滤区域 */
.filter-section {
  background: white;
  padding: 30px 0;
  border-bottom: 1px solid #e8e8e8;
}

.filter-controls {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: 16px 50px 16px 20px;
  border: 2px solid #e8e8e8;
  border-radius: 25px;
  font-size: 1.1rem;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: #adb5bd;
}

.filter-controls-right {
  display: flex;
  gap: 12px;
}

.sort-select {
  padding: 12px 16px;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  background: white;
  font-size: 1rem;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sort-select:focus {
  border-color: #667eea;
}

/* 工具网格 */
.tools-section {
  padding: 40px 0;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.tool-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  cursor: pointer;
  transition: all 0.4s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.tool-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.tool-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.tool-card:hover::before {
  transform: scaleX(1);
}

.tool-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.tool-icon {
  font-size: 3rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 16px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
}

.tool-badges {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.badge {
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
}

.new-badge {
  background: #28a745;
  color: white;
}

.popular-badge {
  background: #ff6b6b;
  color: white;
}

.tool-info {
  margin-bottom: 20px;
}

.tool-name {
  font-size: 1.4rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 12px 0;
}

.tool-description {
  color: #6c757d;
  line-height: 1.6;
  margin: 0 0 16px 0;
  font-size: 1rem;
}

.tool-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.feature-tag {
  background: #e9ecef;
  color: #495057;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.tool-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: #6c757d;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-icon {
  font-size: 1rem;
}

.tool-actions {
  display: flex;
  gap: 12px;
}

.primary-btn,
.secondary-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 0.9rem;
}

.primary-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.secondary-btn {
  background: #f8f9fa;
  color: #495057;
  border: 2px solid #e9ecef;
}

.secondary-btn:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.secondary-btn.favorited {
  background: #fff3cd;
  color: #856404;
  border-color: #ffeaa7;
}

.btn-icon {
  font-size: 1rem;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.5rem;
  color: #495057;
  margin: 0 0 12px 0;
}

.empty-description {
  font-size: 1rem;
  margin: 0 0 24px 0;
  line-height: 1.6;
}

/* 分页器 */
.pagination-section {
  background: white;
  padding: 30px 0;
  border-top: 1px solid #e8e8e8;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.page-btn {
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.page-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
}

.page-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  text-align: center;
  color: #6c757d;
  font-size: 0.9rem;
}

/* 回到顶部 */
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.back-to-top:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.back-to-top-icon {
  font-size: 1.5rem;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .content-wrapper {
    padding: 0 20px;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 0 16px;
  }

  .page-header-section {
    padding: 30px 0;
  }

  .category-title {
    font-size: 2rem;
  }

  .category-description {
    font-size: 1rem;
  }

  .category-icon {
    font-size: 3rem;
    width: 60px;
    height: 60px;
    padding: 12px;
  }

  .header-info {
    flex-direction: column;
    gap: 20px;
  }

  .category-stats {
    text-align: left;
    align-self: flex-start;
  }

  .filter-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .search-box {
    max-width: none;
  }

  .tools-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .tool-card {
    padding: 20px;
  }

  .tool-actions {
    flex-direction: column;
  }

  .pagination-container {
    flex-wrap: wrap;
    gap: 8px;
  }

  .page-numbers {
    order: 2;
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 0 12px;
  }

  .category-display {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .category-title {
    font-size: 1.8rem;
  }

  .tool-card {
    padding: 16px;
  }

  .tool-header {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .tool-badges {
    flex-direction: row;
  }

  .filter-section {
    padding: 20px 0;
  }

  .search-input {
    padding: 14px 45px 14px 16px;
    font-size: 1rem;
  }

  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
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

.tool-card {
  animation: fadeInUp 0.6s ease-out;
}

/* 为不同的工具卡片添加延迟动画 */
.tool-card:nth-child(1) { animation-delay: 0.1s; }
.tool-card:nth-child(2) { animation-delay: 0.2s; }
.tool-card:nth-child(3) { animation-delay: 0.3s; }
.tool-card:nth-child(4) { animation-delay: 0.4s; }
.tool-card:nth-child(5) { animation-delay: 0.5s; }
.tool-card:nth-child(6) { animation-delay: 0.6s; }

/* 滚动显示动画 */
@media (prefers-reduced-motion: no-preference) {
  .tool-list-view {
    scroll-behavior: smooth;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .tool-card {
    border: 2px solid #333;
  }

  .page-header-section {
    background: #333;
  }

  .search-box {
    border: 2px solid #333;
  }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .tool-list-view {
    background: #1a1a1a;
    color: #ffffff;
  }

  .filter-section,
  .pagination-section {
    background: #2d2d2d;
  }

  .tool-card {
    background: #333333;
    color: #ffffff;
  }

  .empty-state {
    color: #ffffff;
  }
}
</style>
