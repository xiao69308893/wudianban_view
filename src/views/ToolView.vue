<template>
  <div class="category-view">
    <!-- 页面标题 -->
    <el-page-header @back="() => $router.go(-1)">
      <template #content>
        <div class="page-title">
          <el-icon size="24"><Calculator /></el-icon>
          <span>电气计算工具</span>
        </div>
      </template>
    </el-page-header>

    <!-- 搜索框 -->
    <div class="search-section">
      <el-input
        v-model="searchText"
        placeholder="搜索计算工具..."
        clearable
        size="large"
        style="max-width: 400px"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- 工具分类网格 -->
    <el-row :gutter="16" class="category-grid">
      <el-col
        v-for="category in filteredCategories"
        :key="category.id"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        class="category-col"
      >
        <el-card
          class="category-card"
          :body-style="{ padding: '20px' }"
          shadow="hover"
          @click="goToCategory(category.id)"
        >
          <!-- 分类图标 -->
          <div class="category-icon">
            <el-icon size="48" :color="category.color">
              <component :is="category.iconComponent" />
            </el-icon>
          </div>

          <!-- 分类信息 -->
          <div class="category-info">
            <h3 class="category-name">{{ category.name }}</h3>
            <p class="category-desc">{{ category.description }}</p>

            <!-- 工具数量标签 -->
            <el-tag size="small" type="info">
              {{ category.toolCount }} 个工具
            </el-tag>
          </div>

          <!-- 进入按钮 -->
          <div class="category-action">
            <el-button type="primary" size="small" :icon="ArrowRight">
              进入
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 空状态 -->
    <el-empty
      v-if="filteredCategories.length === 0"
      description="没有找到相关工具分类"
      :image-size="120"
    />

    <!-- 推荐工具区域 -->
    <div class="recommended-section" v-if="!searchText">
      <el-divider>
        <el-icon><Star /></el-icon>
        推荐工具
      </el-divider>

      <el-row :gutter="12">
        <el-col
          v-for="tool in recommendedTools"
          :key="tool.id"
          :xs="12"
          :sm="8"
          :md="6"
        >
          <el-card
            class="tool-card"
            shadow="hover"
            @click="goToTool(tool.categoryId, tool.id)"
          >
            <div class="tool-icon">{{ tool.icon }}</div>
            <div class="tool-name">{{ tool.name }}</div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Lightning,
  Monitor,
  Setting,
  Tools,
  Search,
  ArrowRight,
  Star
} from '@element-plus/icons-vue'

const router = useRouter()
const searchText = ref('')

// 工具分类数据
const categories = ref([
  {
    id: 1,
    name: '常用计算',
    description: '基础电气参数计算工具',
    icon: '⚡',
    iconComponent: Lightning,
    color: '#409EFF',
    toolCount: 8
  },
  {
    id: 2,
    name: '负荷计算',
    description: '电气负荷需求系数计算',
    icon: '🔌',
    iconComponent: Monitor,
    color: '#67C23A',
    toolCount: 5
  },
  {
    id: 3,
    name: '短路计算',
    description: '短路电流及保护配置',
    icon: '⚠️',
    iconComponent: Setting,
    color: '#E6A23C',
    toolCount: 6
  },
  {
    id: 4,
    name: '电压降计算',
    description: '线路电压降损失计算',
    icon: '📉',
    iconComponent: Tools,
    color: '#F56C6C',
    toolCount: 4
  },
  {
    id: 5,
    name: '电缆选择',
    description: '电缆截面及型号选择',
    icon: '🔗',
    iconComponent: Setting,
    color: '#909399',
    toolCount: 7
  },
  {
    id: 6,
    name: '照明计算',
    description: '照明设计计算工具',
    icon: '💡',
    iconComponent: Tools,
    color: '#f39c12',
    toolCount: 3
  }
])

// 推荐工具
const recommendedTools = ref([
  { id: 1, name: '三相功率计算', icon: '⚡', categoryId: 1 },
  { id: 2, name: '电流计算', icon: '🔋', categoryId: 1 },
  { id: 3, name: '负荷计算', icon: '📊', categoryId: 2 },
  { id: 4, name: '短路电流', icon: '⚠️', categoryId: 3 }
])

// 根据搜索条件过滤分类
const filteredCategories = computed(() => {
  if (!searchText.value) {
    return categories.value
  }

  return categories.value.filter(category =>
    category.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
    category.description.toLowerCase().includes(searchText.value.toLowerCase())
  )
})

// 跳转到分类页面
const goToCategory = (categoryId: number) => {
  router.push({ name: 'category', params: { categoryId } })
}

// 跳转到工具页面
const goToTool = (categoryId: number, toolId: number) => {
  router.push({
    name: 'tool',
    params: { categoryId, toolId }
  })
}
</script>

<style scoped>
.category-view {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
}

.search-section {
  margin: 24px 0;
  display: flex;
  justify-content: center;
}

.category-grid {
  margin: 24px 0;
}

.category-col {
  margin-bottom: 16px;
}

.category-card {
  cursor: pointer;
  transition: all 0.3s;
  height: 100%;
  border-radius: 12px;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.category-icon {
  text-align: center;
  margin-bottom: 16px;
}

.category-info {
  text-align: center;
  margin-bottom: 16px;
}

.category-name {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.category-desc {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.category-action {
  text-align: center;
}

.recommended-section {
  margin-top: 40px;
}

.tool-card {
  text-align: center;
  padding: 16px 8px;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 8px;
  margin-bottom: 12px;
}

.tool-card:hover {
  transform: scale(1.05);
}

.tool-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.tool-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .category-view {
    padding: 0 8px;
  }

  .page-title {
    font-size: 18px;
  }

  .search-section {
    margin: 16px 0;
  }

  .category-name {
    font-size: 16px;
  }

  .category-desc {
    font-size: 13px;
  }
}
</style>
