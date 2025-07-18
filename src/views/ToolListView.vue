<template>
  <div class="tool-list-view">
    <!-- 页面头部 -->
    <el-page-header @back="goBack" class="page-header">
      <template #content>
        <div class="header-content">
          <el-icon size="24" :color="categoryInfo.color">
            <component :is="categoryInfo.iconComponent" />
          </el-icon>
          <div class="header-text">
            <h1>{{ categoryInfo.name }}</h1>
            <p>{{ categoryInfo.description }}</p>
          </div>
        </div>
      </template>
      <template #extra>
        <el-tag type="info" size="large">
          {{ tools.length }} 个工具
        </el-tag>
      </template>
    </el-page-header>

    <!-- 工具搜索和过滤 -->
    <div class="filter-section">
      <el-row :gutter="16" justify="space-between" align="middle">
        <el-col :xs="24" :sm="16">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索工具..."
            clearable
            size="large"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>

        <el-col :xs="24" :sm="8">
          <el-select
            v-model="sortBy"
            placeholder="排序方式"
            size="large"
            style="width: 100%"
          >
            <el-option label="默认排序" value="default" />
            <el-option label="按名称" value="name" />
            <el-option label="最常用" value="popular" />
            <el-option label="最新" value="newest" />
          </el-select>
        </el-col>
      </el-row>
    </div>

    <!-- 工具网格 -->
    <div class="tools-grid">
      <el-row :gutter="16">
        <el-col
          v-for="tool in filteredTools"
          :key="tool.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          class="tool-col"
        >
          <el-card
            class="tool-card"
            shadow="hover"
            @click="goToTool(tool.id)"
            :body-style="{ padding: '20px' }"
          >
            <!-- 工具图标和状态 -->
            <div class="tool-header">
              <div class="tool-icon">{{ tool.icon }}</div>
              <el-tag
                v-if="tool.isNew"
                type="success"
                size="small"
                class="new-tag"
              >
                NEW
              </el-tag>
              <el-tag
                v-if="tool.isPopular"
                type="warning"
                size="small"
                class="popular-tag"
              >
                热门
              </el-tag>
            </div>

            <!-- 工具信息 -->
            <div class="tool-info">
              <h3 class="tool-name">{{ tool.name }}</h3>
              <p class="tool-description">{{ tool.description }}</p>

              <!-- 工具特性标签 -->
              <div class="tool-features">
                <el-tag
                  v-for="feature in tool.features"
                  :key="feature"
                  size="small"
                  type="info"
                  effect="plain"
                >
                  {{ feature }}
                </el-tag>
              </div>
            </div>

            <!-- 工具统计 -->
            <div class="tool-stats">
              <div class="stat-item">
                <el-icon><View /></el-icon>
                <span>{{ tool.viewCount }}</span>
              </div>
              <div class="stat-item">
                <el-icon><Star /></el-icon>
                <span>{{ tool.rating }}</span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="tool-actions">
              <el-button
                type="primary"
                size="small"
                :icon="Right"
                @click.stop="goToTool(tool.id)"
              >
                使用工具
              </el-button>
              <el-button
                size="small"
                :icon="Star"
                @click.stop="toggleFavorite(tool)"
                :type="tool.isFavorite ? 'warning' : 'default'"
              >
                {{ tool.isFavorite ? '已收藏' : '收藏' }}
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 空状态 -->
    <el-empty
      v-if="filteredTools.length === 0"
      description="没有找到相关工具"
      :image-size="120"
    >
      <el-button type="primary" @click="clearSearch">
        清除搜索条件
      </el-button>
    </el-empty>

    <!-- 分页器 -->
    <div class="pagination-container" v-if="totalTools > pageSize">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[12, 24, 48]"
        :total="totalTools"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 快速操作悬浮按钮 -->
    <el-backtop :right="30" :bottom="30">
      <div class="backtop-content">
        <el-icon><CaretTop /></el-icon>
      </div>
    </el-backtop>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Search,
  Right,
  Star,
  View,
  CaretTop,
  Lightning,
  Monitor,
  Setting,
  Tools
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 路由参数
const categoryId = computed(() => parseInt(route.params.categoryId as string))

// 搜索和排序状态
const searchKeyword = ref('')
const sortBy = ref('default')
const currentPage = ref(1)
const pageSize = ref(12)

// 分类信息映射
const categoryInfoMap = {
  1: {
    name: '常用计算',
    description: '基础电气参数计算工具',
    color: '#409EFF',
    iconComponent: Lightning
  },
  2: {
    name: '负荷计算',
    description: '电气负荷需求系数计算',
    color: '#67C23A',
    iconComponent: Monitor
  },
  3: {
    name: '短路计算',
    description: '短路电流及保护配置',
    color: '#E6A23C',
    iconComponent: Setting
  },
  4: {
    name: '电压降计算',
    description: '线路电压降损失计算',
    color: '#F56C6C',
    iconComponent: Tools
  },
  5: {
    name: '电缆选择',
    description: '电缆截面及型号选择',
    color: '#909399',
    iconComponent: Setting
  },
  6: {
    name: '照明计算',
    description: '照明设计计算工具',
    color: '#f39c12',
    iconComponent: Setting
  }
}

// 当前分类信息
const categoryInfo = computed(() =>
    categoryInfoMap[categoryId.value] || {
      name: '未知分类',
      description: '',
      color: '#909399',
      iconComponent: Tools
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
  }
  // 可以添加更多工具数据
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
const tools = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredTools.value.slice(start, end)
})

// 页面方法
const goBack = () => {
  router.go(-1)
}

const goToTool = (toolId: number) => {
  router.push({
    name: 'tool',
    params: { categoryId: categoryId.value, toolId }
  })
}

const toggleFavorite = (tool: any) => {
  tool.isFavorite = !tool.isFavorite
  ElMessage.success(tool.isFavorite ? '已添加到收藏' : '已从收藏中移除')
}

const clearSearch = () => {
  searchKeyword.value = ''
  sortBy.value = 'default'
  currentPage.value = 1
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

onMounted(() => {
  // 页面加载时可以从API获取工具数据
  console.log(`加载分类 ${categoryId.value} 的工具`)
})
</script>

<style scoped>
.tool-list-view {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-text h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.header-text p {
  margin: 4px 0 0 0;
  color: #666;
  font-size: 14px;
}

.filter-section {
  margin-bottom: 24px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tools-grid {
  margin-bottom: 24px;
}

.tool-col {
  margin-bottom: 16px;
}

.tool-card {
  cursor: pointer;
  transition: all 0.3s;
  height: 280px;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.tool-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.tool-icon {
  font-size: 32px;
  text-align: center;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 8px;
}

.new-tag, .popular-tag {
  position: absolute;
  top: 8px;
  right: 8px;
}

.tool-info {
  flex: 1;
  margin-bottom: 12px;
}

.tool-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
}

.tool-description {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 13px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tool-features {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 12px;
}

.tool-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 12px;
  color: #999;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tool-actions {
  display: flex;
  gap: 8px;
}

.tool-actions .el-button {
  flex: 1;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.backtop-content {
  height: 100%;
  width: 100%;
  background-color: var(--el-bg-color-overlay);
  box-shadow: var(--el-box-shadow-lighter);
  text-align: center;
  border-radius: 4px;
  color: var(--el-text-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tool-list-view {
    padding: 0 8px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .header-text h1 {
    font-size: 20px;
  }

  .filter-section {
    padding: 12px;
  }

  .filter-section .el-col {
    margin-bottom: 12px;
  }

  .tool-card {
    height: auto;
    min-height: 240px;
  }

  .tool-actions {
    flex-direction: column;
  }

  .tool-actions .el-button {
    width: 100%;
    margin: 2px 0;
  }
}
</style>
