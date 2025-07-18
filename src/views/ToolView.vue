<template>
  <div class="tool-view">
    <!-- 页面头部 - 统一风格 -->
    <section class="page-header-section">
      <div class="content-wrapper">
        <div class="header-content">
          <button @click="goBack" class="back-button">
            <span class="back-icon">←</span>
            返回工具列表
          </button>

          <div class="tool-header-info" v-if="toolInfo">
            <div class="tool-display">
              <span class="tool-icon">{{ toolInfo.icon }}</span>
              <div class="tool-text">
                <h1 class="tool-title">{{ toolInfo.name }}</h1>
                <p class="tool-description">{{ toolInfo.description }}</p>
                <div class="tool-badges">
                  <span v-if="toolInfo.isNew" class="badge new-badge">NEW</span>
                  <span v-if="toolInfo.isPopular" class="badge popular-badge">热门</span>
                  <span class="badge category-badge">{{ categoryInfo.name }}</span>
                </div>
              </div>
            </div>
            <div class="tool-stats">
              <div class="stat-item">
                <span class="stat-label">使用次数</span>
                <span class="stat-value">{{ toolInfo.viewCount }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">用户评分</span>
                <span class="stat-value">{{ toolInfo.rating }} ⭐</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 工具导航 -->
    <section class="tool-nav-section">
      <div class="content-wrapper">
        <div class="nav-tabs">
          <button
            @click="activeTab = 'calculator'"
            :class="{ 'active': activeTab === 'calculator' }"
            class="nav-tab"
          >
            <span class="tab-icon">🧮</span>
            计算器
          </button>
          <button
            @click="activeTab = 'guide'"
            :class="{ 'active': activeTab === 'guide' }"
            class="nav-tab"
          >
            <span class="tab-icon">📖</span>
            使用指南
          </button>
          <button
            @click="activeTab = 'examples'"
            :class="{ 'active': activeTab === 'examples' }"
            class="nav-tab"
          >
            <span class="tab-icon">💡</span>
            示例
          </button>
          <button
            @click="activeTab = 'comments'"
            :class="{ 'active': activeTab === 'comments' }"
            class="nav-tab"
          >
            <span class="tab-icon">💬</span>
            评论
          </button>
        </div>
      </div>
    </section>

    <!-- 主要内容区域 -->
    <section class="main-content-section">
      <div class="content-wrapper">
        <div class="content-container">
          <!-- 计算器标签页 -->
          <div v-if="activeTab === 'calculator'" class="tab-content calculator-tab">
            <!-- 根据工具ID动态加载对应的计算器组件 -->
            <component
              :is="calculatorComponent"
              @calculate="handleCalculate"
              v-if="calculatorComponent"
            />

            <!-- 如果没有对应的计算器组件，显示占位符 -->
            <div v-else class="calculator-placeholder">
              <div class="placeholder-icon">🚧</div>
              <h3>计算器开发中</h3>
              <p>该工具的计算器正在开发中，敬请期待！</p>
              <button @click="activeTab = 'guide'" class="primary-btn">
                查看使用指南
              </button>
            </div>
          </div>

          <!-- 使用指南标签页 -->
          <div v-if="activeTab === 'guide'" class="tab-content guide-tab">
            <div class="guide-container" v-if="toolInfo">
              <!-- 快速指南 -->
              <div class="guide-section">
                <h2 class="section-title">
                  <span class="title-icon">🚀</span>
                  快速开始
                </h2>
                <div class="guide-steps">
                  <div
                    v-for="(step, index) in toolInfo.quickGuide"
                    :key="index"
                    class="guide-step"
                  >
                    <div class="step-number">{{ index + 1 }}</div>
                    <div class="step-content">{{ step }}</div>
                  </div>
                </div>
              </div>

              <!-- 计算公式 -->
              <div class="guide-section">
                <h2 class="section-title">
                  <span class="title-icon">📐</span>
                  计算公式
                </h2>
                <div class="formulas-list">
                  <div
                    v-for="formula in toolInfo.formulas"
                    :key="formula.name"
                    class="formula-card"
                  >
                    <h3 class="formula-name">{{ formula.name }}</h3>
                    <div class="formula-expression">{{ formula.expression }}</div>
                    <p class="formula-description">{{ formula.description }}</p>
                  </div>
                </div>
              </div>

              <!-- 注意事项 -->
              <div class="guide-section" v-if="toolInfo.notes && toolInfo.notes.length > 0">
                <h2 class="section-title">
                  <span class="title-icon">⚠️</span>
                  注意事项
                </h2>
                <div class="notes-list">
                  <div
                    v-for="note in toolInfo.notes"
                    :key="note"
                    class="note-item"
                  >
                    <span class="note-icon">📝</span>
                    <span class="note-text">{{ note }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 示例标签页 -->
          <div v-if="activeTab === 'examples'" class="tab-content examples-tab">
            <div class="examples-container" v-if="toolInfo">
              <h2 class="section-title">
                <span class="title-icon">💡</span>
                使用示例
              </h2>

              <div class="examples-grid">
                <div
                  v-for="example in toolInfo.examples"
                  :key="example.title"
                  class="example-card"
                >
                  <h3 class="example-title">{{ example.title }}</h3>

                  <div class="example-content">
                    <div class="example-section">
                      <h4>输入参数</h4>
                      <div class="example-inputs">{{ example.inputs }}</div>
                    </div>

                    <div class="example-arrow">→</div>

                    <div class="example-section">
                      <h4>计算结果</h4>
                      <div class="example-result">{{ example.result }}</div>
                    </div>
                  </div>

                  <button
                    @click="loadExample(example)"
                    class="load-example-btn"
                  >
                    <span class="btn-icon">📋</span>
                    加载到计算器
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 评论标签页 -->
          <div v-if="activeTab === 'comments'" class="tab-content comments-tab">
            <div class="comments-container">
              <h2 class="section-title">
                <span class="title-icon">💬</span>
                用户评论
              </h2>

              <!-- 评论输入框 -->
              <div class="comment-input-section">
                <div class="comment-form">
                  <textarea
                    v-model="newComment"
                    placeholder="分享您的使用体验或建议..."
                    rows="3"
                    class="comment-input"
                  ></textarea>
                  <div class="comment-actions">
                    <button @click="submitComment" class="primary-btn">
                      <span class="btn-icon">💬</span>
                      发表评论
                    </button>
                  </div>
                </div>
              </div>

              <!-- 评论列表 -->
              <div class="comments-list">
                <div
                  v-for="comment in comments"
                  :key="comment.id"
                  class="comment-item"
                >
                  <div class="comment-avatar">{{ comment.userAvatar }}</div>
                  <div class="comment-content">
                    <div class="comment-header">
                      <span class="comment-author">{{ comment.userName }}</span>
                      <span class="comment-time">{{ formatDate(comment.timestamp) }}</span>
                    </div>
                    <div class="comment-text">{{ comment.content }}</div>
                  </div>
                </div>
              </div>

              <!-- 评论为空时的占位符 -->
              <div v-if="comments.length === 0" class="comments-empty">
                <div class="empty-icon">💬</div>
                <h3>暂无评论</h3>
                <p>成为第一个评论的用户吧！</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="sidebar">
          <!-- 工具特性 -->
          <div class="sidebar-card">
            <h3 class="card-title">
              <span class="title-icon">✨</span>
              工具特性
            </h3>
            <div class="features-list" v-if="toolInfo">
              <span
                v-for="feature in toolInfo.features"
                :key="feature"
                class="feature-tag"
              >
                {{ feature }}
              </span>
            </div>
          </div>

          <!-- 推荐工具 -->
          <div class="sidebar-card">
            <h3 class="card-title">
              <span class="title-icon">🔧</span>
              推荐工具
            </h3>
            <div class="recommended-tools">
              <div
                v-for="tool in recommendedTools"
                :key="tool.id"
                class="mini-tool-card"
                @click="goToTool(tool.categoryId, tool.id)"
              >
                <span class="mini-tool-icon">{{ tool.icon }}</span>
                <div class="mini-tool-info">
                  <h4 class="mini-tool-name">{{ tool.name }}</h4>
                  <p class="mini-tool-desc">{{ tool.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="sidebar-card">
            <h3 class="card-title">
              <span class="title-icon">⚡</span>
              快速操作
            </h3>
            <div class="action-buttons">
              <button @click="toggleFavorite" class="action-btn" :class="{ 'favorited': isFavorited }">
                <span class="btn-icon">{{ isFavorited ? '❤️' : '🤍' }}</span>
                {{ isFavorited ? '已收藏' : '收藏工具' }}
              </button>
              <button @click="shareTool" class="action-btn">
                <span class="btn-icon">🔗</span>
                分享工具
              </button>
              <button @click="reportIssue" class="action-btn">
                <span class="btn-icon">🐛</span>
                反馈问题
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 路由参数
const categoryId = computed(() => parseInt(route.params.categoryId as string))
const toolId = computed(() => parseInt(route.params.toolId as string))

// 组件状态
const activeTab = ref('calculator')
const newComment = ref('')
const isFavorited = ref(false)

// 分类信息映射
const categoryInfoMap: Record<number, any> = {
  1: { name: '常用计算', icon: '⚡' },
  2: { name: '负荷计算', icon: '📊' },
  3: { name: '短路计算', icon: '⚠️' },
  4: { name: '电压降计算', icon: '📉' },
  5: { name: '电缆选择', icon: '🔌' },
  6: { name: '照明计算', icon: '💡' }
}

// 当前分类信息
const categoryInfo = computed(() =>
  categoryInfoMap[categoryId.value] || { name: '未知分类', icon: '🔧' }
)

// 工具信息映射（模拟数据）
const toolsData: Record<number, any> = {
  1: {
    id: 1,
    name: '三相交流功率计算',
    description: '计算三相交流电路的有功功率、无功功率和视在功率',
    icon: '⚡',
    categoryId: 1,
    features: ['实时计算', '详细过程', '结果导出', '公式展示'],
    viewCount: 1520,
    rating: 4.8,
    isNew: false,
    isPopular: true,
    quickGuide: [
      '输入线电压值（单位：伏特）',
      '输入线电流值（单位：安培）',
      '选择功率因数（0-1之间）',
      '点击计算按钮获得结果',
      '查看详细的计算过程和公式'
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
        result: '有功功率: 27.96kW, 无功功率: 17.36kVar, 视在功率: 32.91kVA',
        inputValues: { voltage: 380, current: 50, powerFactor: 0.85 }
      },
      {
        title: '办公楼照明负荷',
        inputs: '线电压: 220V, 线电流: 15A, 功率因数: 0.9',
        result: '有功功率: 5.15kW, 无功功率: 2.29kVar, 视在功率: 5.72kVA',
        inputValues: { voltage: 220, current: 15, powerFactor: 0.9 }
      }
    ],
    notes: [
      '请确保输入的电压和电流值在合理范围内',
      '功率因数通常在0.7-0.95之间，具体值需根据负荷性质确定',
      '计算结果仅供参考，实际应用请咨询专业电气工程师'
    ]
  },
  2: {
    id: 2,
    name: '单相交流功率计算',
    description: '单相交流电路参数计算工具',
    icon: '🔌',
    categoryId: 1,
    features: ['简单易用', '公式显示', '快速计算'],
    viewCount: 980,
    rating: 4.6,
    isNew: true,
    isPopular: false,
    quickGuide: [
      '输入电压值（单位：伏特）',
      '输入电流值（单位：安培）',
      '输入功率因数（0-1之间）',
      '点击计算按钮获得结果'
    ],
    formulas: [
      {
        name: '单相有功功率',
        expression: 'P = U × I × cosφ',
        description: '其中P为有功功率(W)，U为电压(V)，I为电流(A)，cosφ为功率因数'
      }
    ],
    examples: [
      {
        title: '家用电器功率计算',
        inputs: '电压: 220V, 电流: 5A, 功率因数: 0.8',
        result: '有功功率: 880W, 无功功率: 660Var, 视在功率: 1100VA',
        inputValues: { voltage: 220, current: 5, powerFactor: 0.8 }
      }
    ],
    notes: [
      '单相电路计算相对简单，适用于家用电器和小型设备',
      '功率因数对于阻性负载接近1，对于感性负载会降低'
    ]
  }
  // 可以添加更多工具数据
}

// 当前工具信息
const toolInfo = computed(() => toolsData[toolId.value])

// 计算器组件映射
const calculatorComponents: Record<number, any> = {
  1: defineAsyncComponent(() => import('@/tools/common/ThreePhaseCalculator.vue')),
  2: defineAsyncComponent(() => import('@/tools/common/SinglePhaseCalculator.vue'))
}

// 当前计算器组件
const calculatorComponent = computed(() => calculatorComponents[toolId.value])

// 推荐工具（模拟数据）
const recommendedTools = ref([
  { id: 2, name: '单相功率计算', icon: '🔌', description: '单相电路计算', categoryId: 1 },
  { id: 3, name: '电阻计算器', icon: '🔧', description: '欧姆定律计算', categoryId: 1 },
  { id: 5, name: '设备负荷计算', icon: '📊', description: '负荷需求计算', categoryId: 2 }
])

// 评论数据（模拟）
const comments = ref([
  {
    id: 1,
    userName: '电气工程师张三',
    userAvatar: '👨‍💼',
    content: '这个工具非常实用，计算结果准确，界面也很清晰。在日常工作中经常使用。',
    timestamp: '2025-01-15 14:30:00'
  },
  {
    id: 2,
    userName: '李工',
    userAvatar: '👨‍🔧',
    content: '希望能增加更多的计算示例，对于新手来说会更有帮助。',
    timestamp: '2025-01-10 09:15:00'
  }
])

// 方法
const goBack = () => {
  router.push(`/category/${categoryId.value}`)
}

const goToTool = (catId: number, toolId: number) => {
  router.push(`/category/${catId}/tool/${toolId}`)
}

const handleCalculate = (data: any) => {
  // 处理计算结果，可以记录使用统计等
  console.log('计算结果:', data)

  // 增加工具使用次数
  if (toolInfo.value) {
    toolInfo.value.viewCount++
  }
}

const loadExample = (example: any) => {
  // 加载示例到计算器
  activeTab.value = 'calculator'

  // 这里可以通过事件或者其他方式将示例数据传递给计算器组件
  console.log('加载示例:', example)
}

const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value
  // 这里可以添加收藏到后端的逻辑
}

const shareTools = () => {
  // 分享工具
  if (navigator.share) {
    navigator.share({
      title: toolInfo.value?.name,
      text: toolInfo.value?.description,
      url: window.location.href
    })
  } else {
    // 复制链接到剪贴板
    navigator.clipboard.writeText(window.location.href)
    alert('链接已复制到剪贴板')
  }
}

const reportIssue = () => {
  // 反馈问题
  alert('感谢您的反馈！请通过邮件联系我们：support@example.com')
}

const submitComment = () => {
  if (!newComment.value.trim()) return

  // 添加新评论
  const comment = {
    id: Date.now(),
    userName: '当前用户',
    userAvatar: '👤',
    content: newComment.value,
    timestamp: new Date().toLocaleString()
  }

  comments.value.unshift(comment)
  newComment.value = ''
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

onMounted(() => {
  // 页面加载完成后的初始化操作
  if (!toolInfo.value) {
    // 如果工具不存在，跳转到404页面
    router.push('/404')
  }
})
</script>

<style scoped>
/* 主容器 - 全屏显示，统一风格 */
.tool-view {
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

.tool-header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tool-display {
  display: flex;
  align-items: center;
  gap: 20px;
}

.tool-icon {
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

.tool-text {
  flex: 1;
}

.tool-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.tool-description {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0 0 12px 0;
}

.tool-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
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

.category-badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.tool-stats {
  text-align: right;
}

.stat-item {
  margin-bottom: 8px;
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  opacity: 0.8;
}

.stat-value {
  display: block;
  font-size: 1.2rem;
  font-weight: 600;
}

/* 工具导航 */
.tool-nav-section {
  background: white;
  border-bottom: 1px solid #e8e8e8;
  padding: 0;
}

.nav-tabs {
  display: flex;
  gap: 0;
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px 24px;
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
  font-weight: 500;
}

.nav-tab:hover {
  color: #667eea;
  background: #f8f9fa;
}

.nav-tab.active {
  color: #667eea;
  border-bottom-color: #667eea;
  background: #f8f9fa;
}

.tab-icon {
  font-size: 1.1rem;
}

/* 主要内容区域 */
.main-content-section {
  padding: 40px 0;
}

.content-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 40px;
}

.tab-content {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

/* 计算器标签页 */
.calculator-placeholder {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.placeholder-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.calculator-placeholder h3 {
  color: #495057;
  margin: 0 0 12px 0;
  font-size: 1.5rem;
}

.calculator-placeholder p {
  margin: 0 0 24px 0;
  line-height: 1.6;
}

/* 使用指南标签页 */
.guide-container {
  max-width: 800px;
}

.guide-section {
  margin-bottom: 40px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 24px;
  font-weight: 600;
}

.title-icon {
  font-size: 1.5rem;
}

.guide-steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.guide-step {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.step-number {
  background: #667eea;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  font-size: 1rem;
  line-height: 1.5;
}

.formulas-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.formula-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  border-left: 4px solid #28a745;
}

.formula-name {
  color: #2c3e50;
  margin: 0 0 12px 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.formula-expression {
  background: #e9ecef;
  padding: 12px 16px;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  margin-bottom: 12px;
  color: #495057;
  font-weight: 500;
}

.formula-description {
  color: #6c757d;
  line-height: 1.6;
  margin: 0;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.note-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #fff3cd;
  border-radius: 8px;
  border-left: 4px solid #ffc107;
}

.note-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.note-text {
  flex: 1;
  line-height: 1.5;
  color: #856404;
}

/* 示例标签页 */
.examples-container {
  max-width: 900px;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.example-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.example-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.example-title {
  color: #2c3e50;
  margin: 0 0 20px 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.example-content {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.example-section {
  flex: 1;
}

.example-section h4 {
  color: #495057;
  margin: 0 0 8px 0;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.example-inputs,
.example-result {
  background: white;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  font-size: 0.9rem;
  line-height: 1.4;
}

.example-result {
  border-color: #28a745;
  color: #155724;
  font-weight: 500;
}

.example-arrow {
  font-size: 1.5rem;
  color: #667eea;
  font-weight: bold;
}

.load-example-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.load-example-btn:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

/* 评论标签页 */
.comments-container {
  max-width: 800px;
}

.comment-input-section {
  margin-bottom: 30px;
}

.comment-form {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border: 2px solid #e9ecef;
}

.comment-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  resize: vertical;
  transition: border-color 0.3s ease;
  margin-bottom: 12px;
}

.comment-input:focus {
  border-color: #667eea;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 16px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.comment-avatar {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  background: #e9ecef;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 600;
  color: #2c3e50;
}

.comment-time {
  color: #6c757d;
  font-size: 0.9rem;
}

.comment-text {
  color: #495057;
  line-height: 1.6;
}

.comments-empty {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.comments-empty h3 {
  color: #495057;
  margin: 0 0 12px 0;
  font-size: 1.5rem;
}

.comments-empty p {
  margin: 0;
  line-height: 1.6;
}

/* 侧边栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-card {
  background: white;
  border-radius: 15px;
  padding: 24px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  color: #2c3e50;
  margin: 0 0 16px 0;
  font-weight: 600;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-tag {
  background: #e9ecef;
  color: #495057;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
}

.recommended-tools {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mini-tool-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.mini-tool-card:hover {
  background: #e9ecef;
  border-color: #667eea;
}

.mini-tool-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mini-tool-info {
  flex: 1;
}

.mini-tool-name {
  color: #2c3e50;
  margin: 0 0 4px 0;
  font-size: 0.9rem;
  font-weight: 600;
}

.mini-tool-desc {
  color: #6c757d;
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.3;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f8f9fa;
  color: #495057;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.9rem;
}

.action-btn:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.action-btn.favorited {
  background: #fff3cd;
  color: #856404;
  border-color: #ffeaa7;
}

.primary-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-icon {
  font-size: 1rem;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .content-wrapper {
    padding: 0 20px;
  }

  .content-container {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .sidebar {
    order: -1;
  }

  .sidebar-card {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 0 16px;
  }

  .page-header-section {
    padding: 30px 0;
  }

  .tool-title {
    font-size: 2rem;
  }

  .tool-description {
    font-size: 1rem;
  }

  .tool-icon {
    font-size: 3rem;
    width: 60px;
    height: 60px;
    padding: 12px;
  }

  .tool-header-info {
    flex-direction: column;
    gap: 20px;
  }

  .tool-stats {
    text-align: left;
    align-self: flex-start;
  }

  .nav-tabs {
    flex-wrap: wrap;
  }

  .nav-tab {
    flex: 1;
    min-width: 0;
    padding: 16px 12px;
    font-size: 0.9rem;
  }

  .tab-content {
    padding: 20px;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .examples-grid {
    grid-template-columns: 1fr;
  }

  .example-content {
    flex-direction: column;
    gap: 12px;
  }

  .example-arrow {
    transform: rotate(90deg);
  }

  .guide-step {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .comment-item {
    flex-direction: column;
    gap: 12px;
  }

  .comment-avatar {
    align-self: center;
  }

  .sidebar {
    flex-direction: row;
    overflow-x: auto;
    gap: 16px;
  }

  .sidebar-card {
    min-width: 250px;
    flex-shrink: 0;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 0 12px;
  }

  .tool-display {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .tool-title {
    font-size: 1.8rem;
  }

  .nav-tabs {
    flex-direction: column;
  }

  .nav-tab {
    border-bottom: 1px solid #e8e8e8;
    border-radius: 0;
  }

  .nav-tab.active {
    border-bottom-color: #667eea;
    background: white;
  }

  .tab-content {
    padding: 16px;
  }

  .main-content-section {
    padding: 20px 0;
  }

  .sidebar {
    flex-direction: column;
  }

  .sidebar-card {
    min-width: auto;
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

.tab-content {
  animation: fadeInUp 0.5s ease-out;
}

.guide-step,
.formula-card,
.example-card,
.comment-item {
  animation: fadeInUp 0.6s ease-out;
}

/* 延迟动画 */
.guide-step:nth-child(1) { animation-delay: 0.1s; }
.guide-step:nth-child(2) { animation-delay: 0.2s; }
.guide-step:nth-child(3) { animation-delay: 0.3s; }
.guide-step:nth-child(4) { animation-delay: 0.4s; }
.guide-step:nth-child(5) { animation-delay: 0.5s; }

.formula-card:nth-child(1) { animation-delay: 0.1s; }
.formula-card:nth-child(2) { animation-delay: 0.2s; }
.formula-card:nth-child(3) { animation-delay: 0.3s; }

.example-card:nth-child(1) { animation-delay: 0.1s; }
.example-card:nth-child(2) { animation-delay: 0.2s; }

/* 滚动显示动画 */
@media (prefers-reduced-motion: no-preference) {
  .tool-view {
    scroll-behavior: smooth;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .tab-content,
  .sidebar-card {
    border: 2px solid #333;
  }

  .page-header-section {
    background: #333;
  }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .tool-view {
    background: #1a1a1a;
    color: #ffffff;
  }

  .tool-nav-section {
    background: #2d2d2d;
  }

  .tab-content,
  .sidebar-card {
    background: #333333;
    color: #ffffff;
  }

  .guide-step,
  .formula-card,
  .example-card,
  .comment-item,
  .comment-form {
    background: #404040;
  }

  .section-title {
    color: #ffffff;
  }
}
</style>
