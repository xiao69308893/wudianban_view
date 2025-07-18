<template>
  <div class="tool-admin">
    <!-- 页面头部 -->
    <section class="admin-header">
      <div class="container">
        <div class="header-content">
          <h1>工具管理系统</h1>
          <div class="header-actions">
            <button @click="showAddModal = true" class="add-btn">
              ➕ 添加新工具
            </button>
            <button @click="exportTools" class="export-btn">
              📥 导出配置
            </button>
            <input
              ref="importFileRef"
              type="file"
              accept=".json"
              @change="handleImport"
              style="display: none"
            >
            <button @click="importFileRef?.click()" class="import-btn">
              📤 导入配置
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 统计信息 -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🔧</div>
            <div class="stat-info">
              <span class="stat-number">{{ totalTools }}</span>
              <span class="stat-label">总工具数</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📁</div>
            <div class="stat-info">
              <span class="stat-number">{{ totalCategories }}</span>
              <span class="stat-label">分类数</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <span class="stat-number">{{ totalUsage }}</span>
              <span class="stat-label">总使用次数</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-info">
              <span class="stat-number">{{ averageRating }}</span>
              <span class="stat-label">平均评分</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 工具列表 -->
    <section class="tools-section">
      <div class="container">
        <!-- 过滤和搜索 -->
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

          <select v-model="selectedCategory" class="category-filter">
            <option value="">所有分类</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.icon }} {{ category.name }}
            </option>
          </select>

          <select v-model="sortBy" class="sort-select">
            <option value="name">按名称排序</option>
            <option value="usage">按使用量排序</option>
            <option value="rating">按评分排序</option>
            <option value="updated">按更新时间排序</option>
          </select>
        </div>

        <!-- 工具表格 -->
        <div class="tools-table">
          <table>
            <thead>
            <tr>
              <th>工具信息</th>
              <th>分类</th>
              <th>使用统计</th>
              <th>评分</th>
              <th>状态</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="tool in filteredTools" :key="tool.id">
              <td>
                <div class="tool-info">
                  <span class="tool-icon">{{ tool.icon }}</span>
                  <div class="tool-details">
                    <h4>{{ tool.name }}</h4>
                    <p>{{ tool.description }}</p>
                    <div class="tool-tags">
                      <span v-for="tag in tool.tags" :key="tag" class="tag">{{ tag }}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div class="category-info">
                  {{ getCategoryName(tool.categoryId) }}
                </div>
              </td>
              <td>
                <div class="usage-stats">
                  <div class="usage-count">{{ tool.usageCount }} 次</div>
                  <div class="rating-count">{{ tool.ratingCount }} 个评分</div>
                </div>
              </td>
              <td>
                <div class="rating-display">
                  <span class="rating-value">{{ tool.rating }}</span>
                  <div class="stars">
                      <span
                        v-for="i in 5"
                        :key="i"
                        class="star"
                        :class="{ filled: i <= Math.floor(tool.rating) }"
                      >
                        ⭐
                      </span>
                  </div>
                </div>
              </td>
              <td>
                <div class="status-badges">
                  <span v-if="tool.isNew" class="badge new">新</span>
                  <span v-if="tool.isPopular" class="badge popular">热门</span>
                  <span class="badge active">活跃</span>
                </div>
              </td>
              <td>
                <div class="update-time">
                  {{ formatDate(tool.lastUpdated) }}
                </div>
              </td>
              <td>
                <div class="actions">
                  <button @click="editTool(tool)" class="edit-btn" title="编辑">
                    ✏️
                  </button>
                  <button @click="viewTool(tool)" class="view-btn" title="查看">
                    👁️
                  </button>
                  <button @click="duplicateTool(tool)" class="duplicate-btn" title="复制">
                    📋
                  </button>
                  <button @click="deleteTool(tool)" class="delete-btn" title="删除">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- 添加/编辑工具模态框 -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ isEditing ? '编辑工具' : '添加新工具' }}</h2>
          <button @click="closeModal" class="close-btn">×</button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="saveTool">
            <!-- 基本信息 -->
            <div class="form-section">
              <h3>基本信息</h3>
              <div class="form-row">
                <div class="form-group">
                  <label for="toolName">工具名称 *</label>
                  <input
                    id="toolName"
                    v-model="currentTool.name"
                    type="text"
                    required
                    placeholder="输入工具名称"
                  >
                </div>
                <div class="form-group">
                  <label for="toolIcon">工具图标 *</label>
                  <input
                    id="toolIcon"
                    v-model="currentTool.icon"
                    type="text"
                    required
                    placeholder="选择图标，如 ⚡"
                  >
                </div>
              </div>

              <div class="form-group">
                <label for="toolDescription">工具描述 *</label>
                <textarea
                  id="toolDescription"
                  v-model="currentTool.description"
                  required
                  rows="3"
                  placeholder="详细描述工具的功能和用途"
                ></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="toolCategory">所属分类 *</label>
                  <select id="toolCategory" v-model="currentTool.categoryId" required>
                    <option value="">选择分类</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.icon }} {{ category.name }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="toolComponent">组件名称 *</label>
                  <input
                    id="toolComponent"
                    v-model="currentTool.component"
                    type="text"
                    required
                    placeholder="如：ThreePhaseCalculator"
                  >
                </div>
              </div>

              <div class="form-group">
                <label for="toolFeatures">功能特性</label>
                <div class="tags-input">
                  <input
                    v-model="newFeature"
                    type="text"
                    placeholder="输入特性后按回车添加"
                    @keyup.enter="addFeature"
                  >
                  <div class="tags-list">
                    <span
                      v-for="(feature, index) in currentTool.features"
                      :key="index"
                      class="tag removable"
                    >
                      {{ feature }}
                      <button @click="removeFeature(index)" type="button">×</button>
                    </span>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group checkbox-group">
                  <label>
                    <input v-model="currentTool.isNew" type="checkbox">
                    标记为新工具
                  </label>
                </div>
                <div class="form-group checkbox-group">
                  <label>
                    <input v-model="currentTool.isPopular" type="checkbox">
                    标记为热门工具
                  </label>
                </div>
              </div>
            </div>

            <!-- 快速指南 -->
            <div class="form-section">
              <h3>快速指南</h3>
              <div class="guide-steps">
                <div
                  v-for="(step, index) in currentTool.quickGuide"
                  :key="index"
                  class="step-item"
                >
                  <span class="step-number">{{ index + 1 }}</span>
                  <input
                    v-model="currentTool.quickGuide[index]"
                    type="text"
                    placeholder="输入指南步骤"
                  >
                  <button @click="removeGuideStep(index)" type="button" class="remove-btn">×</button>
                </div>
                <button @click="addGuideStep" type="button" class="add-step-btn">
                  ➕ 添加步骤
                </button>
              </div>
            </div>

            <!-- 计算公式 -->
            <div class="form-section">
              <h3>计算公式</h3>
              <div class="formulas-list">
                <div
                  v-for="(formula, index) in currentTool.formulas"
                  :key="index"
                  class="formula-item"
                >
                  <div class="form-row">
                    <div class="form-group">
                      <label>公式名称</label>
                      <input
                        v-model="formula.name"
                        type="text"
                        placeholder="如：三相有功功率"
                      >
                    </div>
                    <div class="form-group">
                      <label>公式表达式</label>
                      <input
                        v-model="formula.expression"
                        type="text"
                        placeholder="如：P = √3 × U × I × cosφ"
                      >
                    </div>
                  </div>
                  <div class="form-group">
                    <label>公式说明</label>
                    <textarea
                      v-model="formula.description"
                      rows="2"
                      placeholder="详细说明公式中各参数的含义"
                    ></textarea>
                  </div>
                  <button @click="removeFormula(index)" type="button" class="remove-item-btn">
                    删除公式
                  </button>
                </div>
                <button @click="addFormula" type="button" class="add-item-btn">
                  ➕ 添加公式
                </button>
              </div>
            </div>

            <!-- 使用示例 -->
            <div class="form-section">
              <h3>使用示例</h3>
              <div class="examples-list">
                <div
                  v-for="(example, index) in currentTool.examples"
                  :key="index"
                  class="example-item"
                >
                  <div class="form-group">
                    <label>示例标题</label>
                    <input
                      v-model="example.title"
                      type="text"
                      placeholder="如：工厂电机负荷计算"
                    >
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>输入参数</label>
                      <input
                        v-model="example.inputs"
                        type="text"
                        placeholder="如：线电压: 380V, 线电流: 50A"
                      >
                    </div>
                    <div class="form-group">
                      <label>计算结果</label>
                      <input
                        v-model="example.result"
                        type="text"
                        placeholder="如：有功功率: 27.96kW"
                      >
                    </div>
                  </div>
                  <button @click="removeExample(index)" type="button" class="remove-item-btn">
                    删除示例
                  </button>
                </div>
                <button @click="addExample" type="button" class="add-item-btn">
                  ➕ 添加示例
                </button>
              </div>
            </div>

            <!-- 注意事项 -->
            <div class="form-section">
              <h3>注意事项</h3>
              <div class="notes-list">
                <div
                  v-for="(note, index) in currentTool.notes"
                  :key="index"
                  class="note-item"
                >
                  <textarea
                    v-model="currentTool.notes[index]"
                    rows="2"
                    placeholder="输入注意事项"
                  ></textarea>
                  <button @click="removeNote(index)" type="button" class="remove-btn">×</button>
                </div>
                <button @click="addNote" type="button" class="add-step-btn">
                  ➕ 添加注意事项
                </button>
              </div>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="cancel-btn">取消</button>
          <button @click="saveTool" class="save-btn">
            {{ isEditing ? '更新工具' : '创建工具' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ToolManager, type ToolConfig, type ToolFormula, type ToolExample } from '@/tools/tools.config'

const router = useRouter()

// 响应式数据
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('name')
const showAddModal = ref(false)
const showEditModal = ref(false)
const newFeature = ref('')
const importFileRef = ref<HTMLInputElement>()

// 工具数据
const tools = ref<ToolConfig[]>([])
const categories = ref(ToolManager.getAllCategories())

// 当前编辑的工具
const currentTool = ref<ToolConfig>({
  id: 0,
  name: '',
  description: '',
  icon: '',
  categoryId: 0,
  component: '',
  usageCount: 0,
  rating: 0,
  ratingCount: 0,
  isNew: false,
  isPopular: false,
  lastUpdated: '',
  features: [],
  quickGuide: [''],
  formulas: [],
  examples: [],
  notes: []
})

// 计算属性
const isEditing = computed(() => showEditModal.value)

const totalTools = computed(() => tools.value.length)

const totalCategories = computed(() => categories.value.length)

const totalUsage = computed(() =>
  tools.value.reduce((sum, tool) => sum + tool.usageCount, 0)
)

const averageRating = computed(() => {
  const validRatings = tools.value.filter(tool => tool.ratingCount > 0)
  if (validRatings.length === 0) return 0

  const totalRating = validRatings.reduce((sum, tool) => sum + tool.rating, 0)
  return Math.round((totalRating / validRatings.length) * 10) / 10
})

const filteredTools = computed(() => {
  let filtered = [...tools.value]

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(tool =>
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.features.some(feature => feature.toLowerCase().includes(query))
    )
  }

  // 分类过滤
  if (selectedCategory.value) {
    filtered = filtered.filter(tool => tool.categoryId === parseInt(selectedCategory.value))
  }

  // 排序
  switch (sortBy.value) {
    case 'usage':
      filtered.sort((a, b) => b.usageCount - a.usageCount)
      break
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating)
      break
    case 'updated':
      filtered.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      break
    default: // name
      filtered.sort((a, b) => a.name.localeCompare(b.name))
  }

  return filtered
})

// 方法
const loadTools = () => {
  tools.value = ToolManager.getAllTools()
}

const getCategoryName = (categoryId: number) => {
  const category = ToolManager.getCategoryById(categoryId)
  return category ? `${category.icon} ${category.name}` : '未知分类'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 模态框操作
const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  resetCurrentTool()
}

const resetCurrentTool = () => {
  currentTool.value = {
    id: 0,
    name: '',
    description: '',
    icon: '',
    categoryId: 0,
    component: '',
    usageCount: 0,
    rating: 0,
    ratingCount: 0,
    isNew: false,
    isPopular: false,
    lastUpdated: '',
    features: [],
    quickGuide: [''],
    formulas: [],
    examples: [],
    notes: []
  }
}

// 工具操作
const editTool = (tool: ToolConfig) => {
  currentTool.value = { ...tool }
  showEditModal.value = true
}

const viewTool = (tool: ToolConfig) => {
  router.push(`/category/${tool.categoryId}/tool/${tool.id}`)
}

const duplicateTool = (tool: ToolConfig) => {
  const duplicate = {
    ...tool,
    name: `${tool.name} (副本)`,
    id: 0 // 新ID将在保存时分配
  }
  currentTool.value = duplicate
  showAddModal.value = true
}

const deleteTool = (tool: ToolConfig) => {
  if (confirm(`确定要删除工具"${tool.name}"吗？此操作不可恢复。`)) {
    ToolManager.deleteTool(tool.id)
    loadTools()
  }
}

const saveTool = () => {
  // 验证工具配置
  const errors = ToolManager.validateTool(currentTool.value)
  if (errors.length > 0) {
    alert('保存失败：\n' + errors.join('\n'))
    return
  }

  try {
    if (isEditing.value) {
      // 更新工具
      ToolManager.updateTool(currentTool.value.id, currentTool.value)
    } else {
      // 添加新工具
      ToolManager.addTool(currentTool.value)
    }

    loadTools()
    closeModal()

    alert(isEditing.value ? '工具更新成功！' : '工具创建成功！')
  } catch (error) {
    alert('操作失败：' + error)
  }
}

// 特性管理
const addFeature = () => {
  if (newFeature.value.trim()) {
    currentTool.value.features.push(newFeature.value.trim())
    newFeature.value = ''
  }
}

const removeFeature = (index: number) => {
  currentTool.value.features.splice(index, 1)
}

// 指南步骤管理
const addGuideStep = () => {
  currentTool.value.quickGuide.push('')
}

const removeGuideStep = (index: number) => {
  if (currentTool.value.quickGuide.length > 1) {
    currentTool.value.quickGuide.splice(index, 1)
  }
}

// 公式管理
const addFormula = () => {
  currentTool.value.formulas.push({
    name: '',
    expression: '',
    description: ''
  })
}

const removeFormula = (index: number) => {
  currentTool.value.formulas.splice(index, 1)
}

// 示例管理
const addExample = () => {
  currentTool.value.examples.push({
    title: '',
    inputs: '',
    result: ''
  })
}

const removeExample = (index: number) => {
  currentTool.value.examples.splice(index, 1)
}

// 注意事项管理
const addNote = () => {
  currentTool.value.notes.push('')
}

const removeNote = (index: number) => {
  currentTool.value.notes.splice(index, 1)
}

// 导入导出功能
const exportTools = () => {
  const data = ToolManager.exportTools()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `tools-config-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const handleImport = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const importedTools = JSON.parse(e.target?.result as string)
      if (Array.isArray(importedTools)) {
        ToolManager.importTools(importedTools)
        loadTools()
        alert(`成功导入 ${importedTools.length} 个工具配置！`)
      } else {
        alert('导入失败：文件格式不正确')
      }
    } catch (error) {
      alert('导入失败：文件解析错误')
    }
  }
  reader.readAsText(file)

  // 重置文件输入
  if (importFileRef.value) {
    importFileRef.value.value = ''
  }
}

onMounted(() => {
  loadTools()
})
</script>

<style scoped>
.tool-admin {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 页面头部 */
.admin-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.add-btn, .export-btn, .import-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-btn:hover, .export-btn:hover, .import-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* 统计信息 */
.stats-section {
  background: white;
  padding: 2rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 15px;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2.5rem;
  color: #667eea;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
}

.stat-label {
  color: #6c757d;
  font-size: 0.9rem;
}

/* 工具列表 */
.tools-section {
  padding: 2rem 0;
}

.filters-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
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

.category-filter, .sort-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;
}

/* 工具表格 */
.tools-table {
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #e9ecef;
}

td {
  padding: 1rem;
  border-bottom: 1px solid #f8f9fa;
  vertical-align: top;
}

.tool-info {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.tool-icon {
  font-size: 2rem;
  color: #667eea;
}

.tool-details h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #2c3e50;
}

.tool-details p {
  margin: 0 0 0.5rem 0;
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.4;
}

.tool-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.tag {
  background: #e9ecef;
  color: #495057;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 500;
}

.tag.removable {
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.tag.removable button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  font-size: 0.8rem;
}

.category-info {
  font-weight: 500;
  color: #495057;
}

.usage-stats {
  text-align: center;
}

.usage-count {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.rating-count {
  font-size: 0.8rem;
  color: #6c757d;
}

.rating-display {
  text-align: center;
}

.rating-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #667eea;
  display: block;
  margin-bottom: 0.25rem;
}

.stars {
  font-size: 0.8rem;
}

.star {
  margin: 0 0.05rem;
}

.star.filled {
  opacity: 1;
}

.star:not(.filled) {
  opacity: 0.3;
}

.status-badges {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
  text-align: center;
}

.badge.new {
  background: #28a745;
  color: white;
}

.badge.popular {
  background: #ff6b6b;
  color: white;
}

.badge.active {
  background: #17a2b8;
  color: white;
}

.update-time {
  font-size: 0.9rem;
  color: #6c757d;
}

.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.edit-btn, .view-btn, .duplicate-btn, .delete-btn {
  background: none;
  border: 1px solid #e9ecef;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.view-btn:hover {
  background: #28a745;
  border-color: #28a745;
  color: white;
}

.duplicate-btn:hover {
  background: #ffc107;
  border-color: #ffc107;
  color: white;
}

.delete-btn:hover {
  background: #dc3545;
  border-color: #dc3545;
  color: white;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 15px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.modal-footer {
  background: #f8f9fa;
  padding: 1rem 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid #e9ecef;
}

.cancel-btn, .save-btn {
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #6c757d;
  color: white;
  border: none;
}

.save-btn {
  background: #667eea;
  color: white;
  border: none;
}

.cancel-btn:hover {
  background: #5a6268;
}

.save-btn:hover {
  background: #5a67d8;
}

/* 表单样式 */
.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.form-section h3 {
  color: #495057;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #495057;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #667eea;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-group input {
  width: auto;
  margin: 0;
}

.tags-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.guide-steps, .formulas-list, .examples-list, .notes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 1rem;
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
  flex-shrink: 0;
}

.step-item input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

.remove-btn {
  background: #dc3545;
  color: white;
  border: none;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  flex-shrink: 0;
}

.add-step-btn, .add-item-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  align-self: flex-start;
}

.formula-item, .example-item {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.remove-item-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-top: 1rem;
  align-self: flex-start;
}

.note-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.note-item textarea {
  flex: 1;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header-actions {
    flex-direction: column;
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filters-bar {
    flex-direction: column;
  }

  .tools-table {
    overflow-x: auto;
  }

  .modal-overlay {
    padding: 1rem;
  }

  .modal-body {
    padding: 1rem;
  }

  .step-item {
    flex-direction: column;
    align-items: stretch;
  }

  .note-item {
    flex-direction: column;
  }
}
</style>
