<template>
  <div class="tool-view">
    <!-- 面包屑导航 -->
    <section class="breadcrumb-section">
      <div class="container">
        <nav class="breadcrumb">
          <RouterLink to="/categories" class="breadcrumb-item">首页</RouterLink>
          <span class="breadcrumb-separator">></span>
          <RouterLink :to="`/category/${categoryId}`" class="breadcrumb-item">
            {{ categoryName }}
          </RouterLink>
          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-current">{{ toolInfo.name }}</span>
        </nav>
      </div>
    </section>

    <!-- 工具头部信息 -->
    <section class="tool-header">
      <div class="container">
        <div class="header-content">
          <div class="tool-info">
            <span class="tool-icon">{{ toolInfo.icon }}</span>
            <div class="tool-details">
              <div class="tool-meta">
                <h1 class="tool-title">{{ toolInfo.name }}</h1>
                <div class="tool-badges">
                  <span v-if="toolInfo.isNew" class="badge new">新工具</span>
                  <span v-if="toolInfo.isPopular" class="badge popular">热门</span>
                  <span class="badge category">{{ categoryName }}</span>
                </div>
              </div>
              <p class="tool-description">{{ toolInfo.description }}</p>
              <div class="tool-stats">
                <div class="stat-item">
                  <span class="stat-icon">👥</span>
                  <span class="stat-value">{{ toolInfo.usageCount }}</span>
                  <span class="stat-label">使用次数</span>
                </div>
                <div class="stat-item">
                  <span class="stat-icon">⭐</span>
                  <span class="stat-value">{{ toolInfo.rating }}</span>
                  <span class="stat-label">用户评分</span>
                </div>
                <div class="stat-item">
                  <span class="stat-icon">🕒</span>
                  <span class="stat-value">{{ formatDate(toolInfo.lastUpdated) }}</span>
                  <span class="stat-label">最后更新</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 主要内容区域 -->
    <section class="main-content">
      <div class="container">
        <div class="content-layout">
          <!-- 计算器区域 -->
          <div class="calculator-section">
            <div class="calculator-card">
              <div class="card-header">
                <h2>{{ toolInfo.name }}</h2>
                <div class="header-actions">
                  <button @click="resetCalculator" class="reset-btn">重置</button>
                  <button @click="shareCalculator" class="share-btn">分享</button>
                </div>
              </div>

              <div class="calculator-body">
                <!-- 动态加载计算器组件 -->
                <component
                  :is="currentCalculator"
                  @calculate="handleCalculate"
                  ref="calculatorRef"
                />
              </div>
            </div>

            <!-- 计算历史 -->
            <div class="history-card" v-if="calculationHistory.length > 0">
              <h3>计算历史</h3>
              <div class="history-list">
                <div
                  v-for="(record, index) in calculationHistory"
                  :key="index"
                  class="history-item"
                  @click="loadHistoryRecord(record)"
                >
                  <div class="history-time">{{ formatTime(record.timestamp) }}</div>
                  <div class="history-summary">{{ getHistorySummary(record) }}</div>
                </div>
              </div>
              <button @click="clearHistory" class="clear-history-btn">清空历史</button>
            </div>
          </div>

          <!-- 文档和帮助区域 -->
          <div class="documentation-section">
            <!-- 快速指南 -->
            <div class="guide-card">
              <h3>快速指南</h3>
              <div class="guide-steps">
                <div
                  v-for="(step, index) in toolInfo.quickGuide"
                  :key="index"
                  class="guide-step"
                >
                  <span class="step-number">{{ index + 1 }}</span>
                  <span class="step-text">{{ step }}</span>
                </div>
              </div>
            </div>

            <!-- 计算公式 -->
            <div class="formula-card">
              <h3>计算公式</h3>
              <div class="formula-content">
                <div
                  v-for="formula in toolInfo.formulas"
                  :key="formula.name"
                  class="formula-item"
                >
                  <h4>{{ formula.name }}</h4>
                  <div class="formula-expression" v-html="formula.expression"></div>
                  <p class="formula-description">{{ formula.description }}</p>
                </div>
              </div>
            </div>

            <!-- 使用示例 -->
            <div class="example-card">
              <h3>使用示例</h3>
              <div class="example-content">
                <div
                  v-for="example in toolInfo.examples"
                  :key="example.title"
                  class="example-item"
                >
                  <h4>{{ example.title }}</h4>
                  <div class="example-inputs">
                    <strong>输入参数：</strong>
                    <span v-html="example.inputs"></span>
                  </div>
                  <div class="example-result">
                    <strong>计算结果：</strong>
                    <span v-html="example.result"></span>
                  </div>
                  <button
                    @click="loadExample(example)"
                    class="load-example-btn"
                  >
                    加载此示例
                  </button>
                </div>
              </div>
            </div>

            <!-- 注意事项 -->
            <div class="notes-card" v-if="toolInfo.notes && toolInfo.notes.length > 0">
              <h3>注意事项</h3>
              <ul class="notes-list">
                <li v-for="note in toolInfo.notes" :key="note">{{ note }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 用户反馈区域 -->
    <section class="feedback-section">
      <div class="container">
        <div class="feedback-layout">
          <!-- 评分和反馈 -->
          <div class="rating-card">
            <h3>工具评价</h3>
            <div class="rating-display">
              <div class="current-rating">
                <span class="rating-value">{{ toolInfo.rating }}</span>
                <div class="stars">
                  <span
                    v-for="i in 5"
                    :key="i"
                    class="star"
                    :class="{ filled: i <= Math.floor(toolInfo.rating) }"
                  >
                    ⭐
                  </span>
                </div>
                <span class="rating-count">({{ toolInfo.ratingCount }} 个评分)</span>
              </div>

              <div v-if="userStore.isAuthenticated" class="user-rating">
                <p>您的评分：</p>
                <div class="rating-input">
                  <span
                    v-for="i in 5"
                    :key="i"
                    class="star interactive"
                    :class="{ filled: i <= userRating }"
                    @click="setUserRating(i)"
                  >
                    ⭐
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 评论区域 -->
          <CommentSection :toolId="toolId" />
        </div>
      </div>
    </section>

    <!-- 相关工具推荐 -->
    <section class="related-tools">
      <div class="container">
        <h2 class="section-title">相关工具</h2>
        <div class="related-grid">
          <RouterLink
            v-for="tool in relatedTools"
            :key="tool.id"
            :to="`/category/${tool.categoryId}/tool/${tool.id}`"
            class="related-card"
          >
            <span class="tool-icon">{{ tool.icon }}</span>
            <div class="tool-info">
              <h4>{{ tool.name }}</h4>
              <p>{{ tool.description }}</p>
              <div class="tool-meta">
                <span class="usage">{{ tool.usageCount }} 次使用</span>
                <span class="rating">⭐ {{ tool.rating }}</span>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useUsageTracking } from '@/utils/usageTracking'
import CommentSection from '@/components/CommentSection.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { startTracking, stopTracking } = useUsageTracking()

// 路由参数
const categoryId = computed(() => parseInt(route.params.categoryId as string))
const toolId = computed(() => parseInt(route.params.toolId as string))

// 组件引用
const calculatorRef = ref()

// 用户评分
const userRating = ref(0)

// 计算历史
const calculationHistory = ref<any[]>([])

// 工具信息
const toolInfo = ref({
  id: 1,
  name: '三相功率计算器',
  description: '计算三相交流电路的有功功率、无功功率和视在功率，支持星形和三角形连接',
  icon: '⚡',
  usageCount: 1523,
  rating: 4.8,
  ratingCount: 234,
  isNew: false,
  isPopular: true,
  lastUpdated: '2025-01-15',
  quickGuide: [
    '输入线电压值（单位：伏特）',
    '输入线电流值（单位：安培）',
    '选择功率因数（0-1之间）',
    '选择连接方式（星形或三角形）',
    '点击计算按钮获得结果'
  ],
  formulas: [
    {
      name: '三相有功功率',
      expression: 'P = √3 × U × I × cosφ',
      description: '其中P为有功功率(W)，U为线电压(V)，I为线电流(A)，cosφ为功率因数'
    },
    {
      name: '三相无功功率',
      expression: 'Q = √3 × U × I × sinφ',
      description: '其中Q为无功功率(Var)，sinφ = √(1 - cos²φ)'
    },
    {
      name: '三相视在功率',
      expression: 'S = √3 × U × I',
      description: '其中S为视在功率(VA)'
    }
  ],
  examples: [
    {
      title: '工厂电机负荷计算',
      inputs: '线电压: 380V, 线电流: 50A, 功率因数: 0.85',
      result: '有功功率: 27.96kW, 无功功率: 17.36kVar, 视在功率: 32.91kVA'
    },
    {
      title: '办公楼照明负荷',
      inputs: '线电压: 220V, 线电流: 15A, 功率因数: 0.9',
      result: '有功功率: 5.15kW, 无功功率: 2.29kVar, 视在功率: 5.72kVA'
    }
  ],
  notes: [
    '请确保输入的电压和电流值在合理范围内',
    '功率因数通常在0.7-0.95之间，具体值需根据负荷性质确定',
    '计算结果仅供参考，实际应用请咨询专业电气工程师'
  ]
})

// 分类名称
const categoryName = computed(() => {
  const categories = {
    1: '常用计算',
    2: '负荷计算',
    3: '短路计算',
    4: '电压降计算',
    5: '电缆选择',
    6: '照明计算'
  }
  return categories[categoryId.value as keyof typeof categories] || '未知分类'
})

// 动态加载计算器组件
const currentCalculator = computed(() => {
  // 根据工具ID动态导入对应的计算器组件
  const calculatorMap: { [key: number]: any } = {
    1: defineAsyncComponent(() => import('@/tools/common/ThreePhaseCalculator.vue')),
    2: defineAsyncComponent(() => import('@/tools/common/SinglePhaseCalculator.vue')),
    // 可以继续添加更多工具组件
  }

  return calculatorMap[toolId.value] || null
})

// 相关工具
const relatedTools = ref([
  {
    id: 2,
    name: '单相功率计算器',
    description: '计算单相交流电路功率参数',
    icon: '🔌',
    usageCount: 956,
    rating: 4.6,
    categoryId: 1
  },
  {
    id: 3,
    name: '欧姆定律计算器',
    description: '计算电压、电流、电阻关系',
    icon: 'Ω',
    usageCount: 2134,
    rating: 4.9,
    categoryId: 1
  },
  {
    id: 7,
    name: '电缆载流量计算',
    description: '计算电缆载流量和选型',
    icon: '🔌',
    usageCount: 687,
    rating: 4.7,
    categoryId: 5
  }
])

// 处理计算结果
const handleCalculate = (result: any) => {
  // 记录计算历史
  const record = {
    timestamp: new Date(),
    inputs: result.inputs,
    results: result.result,
    toolId: toolId.value
  }

  calculationHistory.value.unshift(record)

  // 限制历史记录数量
  if (calculationHistory.value.length > 10) {
    calculationHistory.value = calculationHistory.value.slice(0, 10)
  }

  // 保存到本地存储
  saveCalculationHistory()

  // 跟踪使用情况
  trackToolUsage()
}

// 重置计算器
const resetCalculator = () => {
  if (calculatorRef.value && calculatorRef.value.reset) {
    calculatorRef.value.reset()
  }
}

// 分享计算器
const shareCalculator = async () => {
  const shareData = {
    title: toolInfo.value.name,
    text: toolInfo.value.description,
    url: window.location.href
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      // 备用方案：复制到剪贴板
      await navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板')
    }
  } catch (error) {
    console.error('分享失败:', error)
  }
}

// 加载历史记录
const loadHistoryRecord = (record: any) => {
  if (calculatorRef.value && calculatorRef.value.loadInputs) {
    calculatorRef.value.loadInputs(record.inputs)
  }
}

// 清空历史记录
const clearHistory = () => {
  calculationHistory.value = []
  localStorage.removeItem(`calculator_history_${toolId.value}`)
}

// 加载示例
const loadExample = (example: any) => {
  if (calculatorRef.value && calculatorRef.value.loadExample) {
    calculatorRef.value.loadExample(example)
  }
}

// 设置用户评分
const setUserRating = async (rating: number) => {
  userRating.value = rating

  try {
    // 这里应该调用API保存用户评分
    // await saveUserRating(toolId.value, rating)
    console.log('用户评分已保存:', rating)
  } catch (error) {
    console.error('保存评分失败:', error)
  }
}

// 跟踪工具使用
const trackToolUsage = () => {
  // 更新使用次数
  toolInfo.value.usageCount++

  // 发送使用统计
  stopTracking(toolId.value.toString())
}

// 保存计算历史
const saveCalculationHistory = () => {
  localStorage.setItem(
    `calculator_history_${toolId.value}`,
    JSON.stringify(calculationHistory.value)
  )
}

// 加载计算历史
const loadCalculationHistory = () => {
  const saved = localStorage.getItem(`calculator_history_${toolId.value}`)
  if (saved) {
    try {
      calculationHistory.value = JSON.parse(saved)
    } catch (error) {
      console.error('加载历史记录失败:', error)
    }
  }
}

// 获取历史记录摘要
const getHistorySummary = (record: any) => {
  // 根据工具类型生成摘要
  if (record.inputs.voltage && record.inputs.current) {
    return `U=${record.inputs.voltage}V, I=${record.inputs.current}A`
  }
  return '计算记录'
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 格式化时间
const formatTime = (date: Date) => {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 根据工具ID更新工具信息
const updateToolInfo = () => {
  // 这里应该从API获取工具信息
  // 暂时使用模拟数据
  const toolsData = {
    1: {
      name: '三相功率计算器',
      description: '计算三相交流电路的有功功率、无功功率和视在功率',
      icon: '⚡'
    },
    2: {
      name: '单相功率计算器',
      description: '计算单相交流电路的功率参数',
      icon: '🔌'
    },
    3: {
      name: '欧姆定律计算器',
      description: '根据欧姆定律计算电压、电流、电阻',
      icon: 'Ω'
    }
  }

  const toolData = toolsData[toolId.value as keyof typeof toolsData]
  if (toolData) {
    Object.assign(toolInfo.value, toolData)
  }
}

onMounted(() => {
  updateToolInfo()
  loadCalculationHistory()
  startTracking(toolId.value.toString())
})
</script>

<style scoped>
.tool-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.container {
  max-width: 1400px;
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

/* 工具头部 */
.tool-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tool-info {
  display: flex;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.tool-icon {
  font-size: 5rem;
  opacity: 0.9;
}

.tool-details {
  flex: 1;
}

.tool-meta {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.tool-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.tool-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge.new {
  background: #28a745;
}

.badge.popular {
  background: #ff6b6b;
}

.badge.category {
  background: rgba(255, 255, 255, 0.2);
}

.tool-description {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.tool-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 10px;
  min-width: 120px;
}

.stat-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  opacity: 0.8;
}

/* 主要内容 */
.main-content {
  padding: 3rem 0;
}

.content-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
}

/* 计算器区域 */
.calculator-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.calculator-card,
.history-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.reset-btn,
.share-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover,
.share-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.calculator-body {
  padding: 2rem;
}

/* 历史记录 */
.history-card h3 {
  background: #f8f9fa;
  margin: 0;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e9ecef;
  font-size: 1.1rem;
  color: #495057;
}

.history-list {
  max-height: 300px;
  overflow-y: auto;
}

.history-item {
  padding: 1rem 2rem;
  border-bottom: 1px solid #f8f9fa;
  cursor: pointer;
  transition: background 0.3s ease;
}

.history-item:hover {
  background: #f8f9fa;
}

.history-time {
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.history-summary {
  font-size: 0.9rem;
  color: #495057;
}

.clear-history-btn {
  width: 100%;
  padding: 1rem;
  background: #dc3545;
  color: white;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.clear-history-btn:hover {
  background: #c82333;
}

/* 文档区域 */
.documentation-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.guide-card,
.formula-card,
.example-card,
.notes-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.guide-card h3,
.formula-card h3,
.example-card h3,
.notes-card h3 {
  background: #f8f9fa;
  margin: 0;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
  font-size: 1.1rem;
  color: #495057;
}

.guide-steps {
  padding: 1.5rem;
}

.guide-step {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.step-number {
  background: #667eea;
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.step-text {
  flex: 1;
  color: #495057;
  line-height: 1.5;
}

/* 公式区域 */
.formula-content {
  padding: 1.5rem;
}

.formula-item {
  margin-bottom: 2rem;
}

.formula-item:last-child {
  margin-bottom: 0;
}

.formula-item h4 {
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.formula-expression {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  color: #495057;
  margin-bottom: 0.5rem;
  border-left: 4px solid #667eea;
}

.formula-description {
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

/* 示例区域 */
.example-content {
  padding: 1.5rem;
}

.example-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
}

.example-item:last-child {
  margin-bottom: 0;
}

.example-item h4 {
  color: #495057;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.example-inputs,
.example-result {
  margin-bottom: 1rem;
  font-size: 0.9rem;
  line-height: 1.5;
}

.example-inputs strong,
.example-result strong {
  color: #495057;
}

.load-example-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.load-example-btn:hover {
  background: #5a67d8;
}

/* 注意事项 */
.notes-list {
  padding: 1.5rem;
  margin: 0;
}

.notes-list li {
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

/* 反馈区域 */
.feedback-section {
  background: white;
  padding: 3rem 0;
  margin-top: 2rem;
}

.feedback-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
}

.rating-card {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.rating-card h3 {
  margin-bottom: 1.5rem;
  color: #495057;
}

.current-rating {
  text-align: center;
  margin-bottom: 2rem;
}

.rating-value {
  font-size: 3rem;
  font-weight: 700;
  color: #667eea;
  display: block;
  margin-bottom: 0.5rem;
}

.stars {
  margin-bottom: 0.5rem;
}

.star {
  font-size: 1.5rem;
  margin: 0 0.1rem;
}

.star.filled {
  opacity: 1;
}

.star:not(.filled) {
  opacity: 0.3;
}

.rating-count {
  color: #6c757d;
  font-size: 0.9rem;
}

.user-rating {
  text-align: center;
}

.user-rating p {
  margin-bottom: 1rem;
  color: #495057;
}

.rating-input .star {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.rating-input .star:hover {
  transform: scale(1.2);
}

/* 相关工具 */
.related-tools {
  background: #f8f9fa;
  padding: 3rem 0;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-weight: 600;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.related-card {
  background: white;
  padding: 1.5rem;
  border-radius: 15px;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.related-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.related-card .tool-icon {
  font-size: 2.5rem;
  color: #667eea;
}

.tool-info {
  flex: 1;
}

.tool-info h4 {
  margin-bottom: 0.5rem;
  color: #495057;
  font-size: 1.1rem;
}

.tool-info p {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.tool-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #adb5bd;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .content-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .feedback-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .tool-info {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .tool-icon {
    font-size: 3rem;
  }

  .tool-title {
    font-size: 2rem;
  }

  .tool-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .tool-meta {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .header-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .related-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>
