<template>
  <div class="tool-list-view">
    <!-- 面包屑导航 -->
    <section class="breadcrumb-section">
      <div class="container">
        <nav class="breadcrumb">
          <RouterLink to="/categories" class="breadcrumb-item">首页</RouterLink>
          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-current">{{ categoryInfo.name }}</span>
        </nav>
      </div>
    </section>

    <!-- 分类头部 -->
    <section class="category-header">
      <div class="container">
        <div class="header-content">
          <div class="category-info">
            <span class="category-icon">{{ categoryInfo.icon }}</span>
            <div class="category-details">
              <h1 class="category-title">{{ categoryInfo.name }}</h1>
              <p class="category-description">{{ categoryInfo.description }}</p>
              <div class="category-stats">
                <span class="tool-count">{{ tools.length }} 个工具</span>
                <span class="usage-count">累计使用 {{ categoryInfo.usageCount }} 次</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 工具筛选和搜索 -->
    <section class="filters-section">
      <div class="container">
        <div class="filters-bar">
          <div class="search-box">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索工具..."
              class="search-input"
            >
            <span class="search-icon">🔍</span>
          </div>

          <div class="filter-options">
            <select v-model="sortOption" class="sort-select">
              <option value="name">按名称排序</option>
              <option value="usage">按使用频率</option>
              <option value="recent">最近添加</option>
            </select>

            <div class="view-toggle">
              <button
                @click="viewMode = 'grid'"
                :class="{ active: viewMode === 'grid' }"
                class="view-btn"
              >
                ⊞
              </button>
              <button
                @click="viewMode = 'list'"
                :class="{ active: viewMode === 'list' }"
                class="view-btn"
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 工具列表 -->
    <section class="tools-section">
      <div class="container">
        <div :class="['tools-container', `view-${viewMode}`]">
          <div
            v-for="tool in filteredTools"
            :key="tool.id"
            class="tool-item"
            @click="goToTool(tool.id)"
          >
            <div class="tool-card">
              <div class="tool-header">
                <span class="tool-icon">{{ tool.icon }}</span>
                <div class="tool-meta">
                  <span v-if="tool.isNew" class="new-badge">新</span>
                  <span v-if="tool.isPopular" class="popular-badge">热门</span>
                </div>
              </div>

              <div class="tool-content">
                <h3 class="tool-name">{{ tool.name }}</h3>
                <p class="tool-description">{{ tool.description }}</p>

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

              <div class="tool-footer">
                <div class="tool-stats">
                  <span class="usage-stat">
                    <span class="stat-icon">👥</span>
                    {{ tool.usageCount }}
                  </span>
                  <span class="rating-stat">
                    <span class="stat-icon">⭐</span>
                    {{ tool.rating }}
                  </span>
                </div>

                <button class="use-tool-btn">
                  使用工具 →
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredTools.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>未找到相关工具</h3>
          <p>尝试调整搜索条件或浏览其他分类</p>
          <RouterLink to="/categories" class="back-btn">返回首页</RouterLink>
        </div>
      </div>
    </section>

    <!-- 推荐工具 -->
    <section class="recommended-section" v-if="recommendedTools.length > 0">
      <div class="container">
        <h2 class="section-title">推荐工具</h2>
        <div class="recommended-grid">
          <RouterLink
            v-for="tool in recommendedTools"
            :key="tool.id"
            :to="`/category/${tool.categoryId}/tool/${tool.id}`"
            class="recommended-card"
          >
            <span class="tool-icon">{{ tool.icon }}</span>
            <div class="tool-info">
              <h4>{{ tool.name }}</h4>
              <p>{{ tool.description }}</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 获取分类ID
const categoryId = computed(() => parseInt(route.params.categoryId as string))

// 搜索和筛选
const searchQuery = ref('')
const sortOption = ref('name')
const viewMode = ref<'grid' | 'list'>('grid')

// 分类信息
const categoryInfo = ref({
  id: 1,
  name: '常用计算',
  icon: '⚡',
  description: '电压、电流、功率等基础电气参数计算工具',
  usageCount: 12547
})

// 工具数据
const tools = ref([
  {
    id: 1,
    name: '三相功率计算器',
    description: '计算三相交流电路的有功功率、无功功率和视在功率',
    icon: '⚡',
    features: ['三相电路', '功率计算', '实时结果'],
    usageCount: 1523,
    rating: 4.8,
    isNew: false,
    isPopular: true,
    categoryId: 1
  },
  {
    id: 2,
    name: '单相功率计算器',
    description: '计算单相交流电路的功率参数和电气量',
    icon: '🔌',
    features: ['单相电路', '基础计算', '快速便捷'],
    usageCount: 956,
    rating: 4.6,
    isNew: false,
    isPopular: false,
    categoryId: 1
  },
  {
    id: 3,
    name: '欧姆定律计算器',
    description: '根据欧姆定律计算电压、电流、电阻之间的关系',
    icon: 'Ω',
    features: ['欧姆定律', '基础公式', '教学工具'],
    usageCount: 2134,
    rating: 4.9,
    isNew: false,
    isPopular: true,
    categoryId: 1
  },
  {
    id: 4,
    name: 'RLC电路计算器',
    description: '计算RLC串联和并联电路的阻抗、相位等参数',
    icon: '🔄',
    features: ['RLC电路', '阻抗计算', '相位分析'],
    usageCount: 687,
    rating: 4.7,
    isNew: true,
    isPopular: false,
    categoryId: 1
  },
  {
    id: 5,
    name: '变压器计算器',
    description: '计算变压器的变比、功率损耗和效率等参数',
    icon: '🔀',
    features: ['变压器', '变比计算', '效率分析'],
    usageCount: 423,
    rating: 4.5,
    isNew: true,
    isPopular: false,
    categoryId: 1
  },
  {
    id: 6,
    name: '电容器计算器',
    description: '计算电容器的容抗、储能和充放电参数',
    icon: '🔋',
    features: ['电容计算', '储能分析', '时间常数'],
    usageCount: 334,
    rating: 4.4,
    isNew: false,
    isPopular: false,
    categoryId: 1
  }
])

// 推荐工具
const recommendedTools = ref([
  {
    id: 7,
    name: '电缆载流量计算',
    description: '计算不同截面电缆的载流量',
    icon: '🔌',
    categoryId: 5
  },
  {
    id: 8,
    name: '照度计算器',
    description: '计算室内外照明照度值',
    icon: '💡',
    categoryId: 6
  }
])

// 计算过滤后的工具
const filteredTools = computed(() => {
  let filtered = tools.value

  // 搜索过滤
  if (searchQuery.value) {
    filtered = filtered.filter(tool =>
      tool.name.includes(searchQuery.value) ||
      tool.description.includes(searchQuery.value) ||
      tool.features.some(feature => feature.includes(searchQuery.value))
    )
  }

  // 排序
  switch (sortOption.value) {
    case 'usage':
      filtered.sort((a, b) => b.usageCount - a.usageCount)
      break
    case 'recent':
      filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
      break
    default: // name
      filtered.sort((a, b) => a.name.localeCompare(b.name))
  }

  return filtered
})

// 跳转到工具详情
const goToTool = (toolId: number) => {
  router.push({
    name: 'tool',
    params: {
      categoryId: categoryId.value,
      toolId
    }
  })
}

// 根据分类ID更新分类信息
const updateCategoryInfo = () => {
  const categories = {
    1: { name: '常用计算', icon: '⚡', description: '电压、电流、功率等基础电气参数计算工具', usageCount: 12547 },
    2: { name: '负荷计算', icon: '📊', description: '设备负荷、用电量、需用系数等计算工具', usageCount: 8934 },
    3: { name: '短路计算', icon: '⚠️', description: '短路电流、保护设备选择等安全计算工具', usageCount: 6721 },
    4: { name: '电压降计算', icon: '📉', description: '线路电压降、补偿计算等配电计算工具', usageCount: 5432 },
    5: { name: '电缆选择', icon: '🔌', description: '电缆截面、载流量、选型等计算工具', usageCount: 9876 },
    6: { name: '照明计算', icon: '💡', description: '照度计算、灯具布置、节能分析工具', usageCount: 4567 }
  }

  const info = categories[categoryId.value as keyof typeof categories]
  if (info) {
    categoryInfo.value = {
      id: categoryId.value,
      ...info
    }
  }
}

onMounted(() => {
  updateCategoryInfo()
})
</script>

<style scoped>
.tool-list-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 面包屑导航 */
.breadcrumb-section {
  background: white;
  padding: 1rem 0;
  border-bottom: 1px solid #e9ecef;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.breadcrumb-item {
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-item:hover {
  color: #5a67d8;
}

.breadcrumb-separator {
  color: #adb5bd;
}

.breadcrumb-current {
  color: #6c757d;
  font-weight: 500;
}

/* 分类头部 */
.category-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.category-icon {
  font-size: 4rem;
  opacity: 0.9;
}

.category-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.category-description {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.category-stats {
  display: flex;
  gap: 2rem;
  font-size: 0.9rem;
}

.tool-count,
.usage-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
}

/* 筛选区域 */
.filters-section {
  background: white;
  padding: 1.5rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.filters-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid #e9ecef;
  border-radius: 25px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  border-color: #667eea;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #adb5bd;
  font-size: 1.1rem;
}

.filter-options {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sort-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;
}

.view-toggle {
  display: flex;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.view-btn {
  padding: 0.75rem 1rem;
  border: none;
  background: white;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.view-btn.active {
  background: #667eea;
  color: white;
}

/* 工具区域 */
.tools-section {
  padding: 2rem 0;
}

.tools-container.view-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.tools-container.view-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tool-item {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.tool-item:hover {
  transform: translateY(-5px);
}

.tool-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tool-card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.view-list .tool-card {
  flex-direction: row;
  align-items: center;
  gap: 2rem;
  padding: 1rem 1.5rem;
}

.tool-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.view-list .tool-header {
  margin-bottom: 0;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.tool-icon {
  font-size: 3rem;
  color: #667eea;
}

.view-list .tool-icon {
  font-size: 2rem;
}

.tool-meta {
  display: flex;
  gap: 0.5rem;
}

.new-badge,
.popular-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
}

.new-badge {
  background: #28a745;
  color: white;
}

.popular-badge {
  background: #ff6b6b;
  color: white;
}

.tool-content {
  flex: 1;
  margin-bottom: 1rem;
}

.view-list .tool-content {
  margin-bottom: 0;
}

.tool-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.tool-description {
  color: #666;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.tool-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.feature-tag {
  background: #f8f9fa;
  color: #667eea;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.tool-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.view-list .tool-footer {
  margin-top: 0;
  flex-direction: column;
  gap: 1rem;
}

.tool-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.usage-stat,
.rating-stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stat-icon {
  font-size: 0.8rem;
}

.use-tool-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.use-tool-btn:hover {
  background: #5a67d8;
  transform: translateX(3px);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: #495057;
}

.back-btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 25px;
  transition: background 0.3s ease;
}

.back-btn:hover {
  background: #5a67d8;
}

/* 推荐工具 */
.recommended-section {
  background: white;
  padding: 3rem 0;
  margin-top: 2rem;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-weight: 600;
}

.recommended-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.recommended-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.recommended-card:hover {
  background: #667eea;
  color: white;
  transform: translateY(-3px);
}

.recommended-card .tool-icon {
  font-size: 2rem;
}

.tool-info h4 {
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.tool-info p {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .category-info {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .category-icon {
    font-size: 3rem;
  }

  .category-title {
    font-size: 2rem;
  }

  .category-stats {
    flex-direction: column;
    gap: 0.5rem;
  }

  .filters-bar {
    flex-direction: column;
    gap: 1rem;
  }

  .filter-options {
    width: 100%;
    justify-content: space-between;
  }

  .tools-container.view-grid {
    grid-template-columns: 1fr;
  }

  .tools-container.view-list .tool-card {
    flex-direction: column;
    text-align: center;
  }

  .recommended-grid {
    grid-template-columns: 1fr;
  }
}
</style>
