<template>
  <div class="calculator">
    <!-- 计算器标题 -->
    <el-card class="calculator-card" shadow="always">
      <template #header>
        <div class="card-header">
          <el-icon size="20"><Lightning /></el-icon>
          <span>三相交流电路计算器</span>
        </div>
      </template>

      <!-- 输入参数区域 -->
      <el-form :model="formData" label-position="top" class="calculator-form">
        <el-row :gutter="16">
          <el-col :xs="24" :sm="8">
            <el-form-item label="线电压 (V)">
              <el-input-number
                v-model="formData.voltage"
                :min="0"
                :max="100000"
                :precision="1"
                :step="10"
                size="large"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="8">
            <el-form-item label="线电流 (A)">
              <el-input-number
                v-model="formData.current"
                :min="0"
                :max="10000"
                :precision="2"
                :step="0.1"
                size="large"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="8">
            <el-form-item label="功率因数">
              <el-input-number
                v-model="formData.powerFactor"
                :min="0"
                :max="1"
                :precision="2"
                :step="0.01"
                size="large"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 计算按钮 -->
        <el-row justify="center" class="button-row">
          <el-button
            type="primary"
            size="large"
            :icon="Calculator"
            @click="calculate"
            :loading="calculating"
          >
            {{ calculating ? '计算中...' : '开始计算' }}
          </el-button>

          <el-button
            size="large"
            :icon="RefreshRight"
            @click="resetForm"
          >
            重置
          </el-button>
        </el-row>
      </el-form>
    </el-card>

    <!-- 计算结果区域 -->
    <el-card v-if="showResults" class="results-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon size="20"><DataAnalysis /></el-icon>
          <span>计算结果</span>
        </div>
      </template>

      <el-row :gutter="16">
        <el-col :xs="24" :sm="8">
          <el-statistic
            title="有功功率"
            :value="results.activePower"
            suffix="kW"
            :precision="2"
          >
            <template #prefix>
              <el-icon color="#409EFF"><Lightning /></el-icon>
            </template>
          </el-statistic>
        </el-col>

        <el-col :xs="24" :sm="8">
          <el-statistic
            title="无功功率"
            :value="results.reactivePower"
            suffix="kvar"
            :precision="2"
          >
            <template #prefix>
              <el-icon color="#67C23A"><TrendCharts /></el-icon>
            </template>
          </el-statistic>
        </el-col>

        <el-col :xs="24" :sm="8">
          <el-statistic
            title="视在功率"
            :value="results.apparentPower"
            suffix="kVA"
            :precision="2"
          >
            <template #prefix>
              <el-icon color="#E6A23C"><PieChart /></el-icon>
            </template>
          </el-statistic>
        </el-col>
      </el-row>

      <!-- 计算过程展示 -->
      <el-divider>计算过程</el-divider>
      <div class="calculation-process">
        <el-timeline>
          <el-timeline-item timestamp="步骤1" color="#409EFF">
            <p>有功功率: P = √3 × U × I × cosφ</p>
            <p>P = √3 × {{ formData.voltage }} × {{ formData.current }} × {{ formData.powerFactor }}</p>
            <p><strong>P = {{ results.activePower.toFixed(2) }} kW</strong></p>
          </el-timeline-item>

          <el-timeline-item timestamp="步骤2" color="#67C23A">
            <p>无功功率: Q = √3 × U × I × sinφ</p>
            <p>Q = √3 × {{ formData.voltage }} × {{ formData.current }} × {{ Math.sqrt(1 - Math.pow(formData.powerFactor, 2)).toFixed(3) }}</p>
            <p><strong>Q = {{ results.reactivePower.toFixed(2) }} kvar</strong></p>
          </el-timeline-item>

          <el-timeline-item timestamp="步骤3" color="#E6A23C">
            <p>视在功率: S = √3 × U × I</p>
            <p>S = √3 × {{ formData.voltage }} × {{ formData.current }}</p>
            <p><strong>S = {{ results.apparentPower.toFixed(2) }} kVA</strong></p>
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- 结果操作按钮 -->
      <el-row justify="center" class="result-actions">
        <el-button :icon="Download" @click="exportResults">
          导出结果
        </el-button>
        <el-button :icon="Share" @click="shareResults">
          分享结果
        </el-button>
      </el-row>
    </el-card>

    <!-- 提示信息 -->
    <el-alert
      v-if="!showResults"
      title="使用说明"
      type="info"
      :closable="false"
      show-icon
    >
      <p>1. 输入三相电路的线电压（V）、线电流（A）和功率因数</p>
      <p>2. 功率因数范围为0-1，常见值：电阻负载=1，电感负载=0.8</p>
      <p>3. 点击"开始计算"按钮获取详细计算结果</p>
    </el-alert>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Lightning,
  Calculator,
  RefreshRight,
  DataAnalysis,
  TrendCharts,
  PieChart,
  Download,
  Share
} from '@element-plus/icons-vue'

// 表单数据
const formData = reactive({
  voltage: 380,    // 线电压
  current: 10,     // 线电流
  powerFactor: 0.8 // 功率因数
})

// 计算状态
const calculating = ref(false)
const showResults = ref(false)

// 计算结果
const results = reactive({
  activePower: 0,    // 有功功率 kW
  reactivePower: 0,  // 无功功率 kvar
  apparentPower: 0   // 视在功率 kVA
})

// 发送事件给父组件
const emit = defineEmits(['calculate'])

// 执行计算
const calculate = async () => {
  // 输入验证
  if (formData.powerFactor < 0 || formData.powerFactor > 1) {
    ElMessage.error('功率因数必须在0-1之间')
    return
  }

  calculating.value = true

  try {
    // 模拟计算过程延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 计算有功功率 P = √3 × U × I × cosφ
    results.activePower = (Math.sqrt(3) * formData.voltage * formData.current * formData.powerFactor) / 1000

    // 计算无功功率 Q = √3 × U × I × sinφ
    const sinPhi = Math.sqrt(1 - Math.pow(formData.powerFactor, 2))
    results.reactivePower = (Math.sqrt(3) * formData.voltage * formData.current * sinPhi) / 1000

    // 计算视在功率 S = √3 × U × I
    results.apparentPower = (Math.sqrt(3) * formData.voltage * formData.current) / 1000

    showResults.value = true

    // 触发父组件事件
    emit('calculate', {
      toolId: 'three-phase',
      inputs: { ...formData },
      results: { ...results }
    })

    ElMessage.success('计算完成！')

  } catch (error) {
    ElMessage.error('计算过程中出现错误')
  } finally {
    calculating.value = false
  }
}

// 重置表单
const resetForm = () => {
  formData.voltage = 380
  formData.current = 10
  formData.powerFactor = 0.8
  showResults.value = false
  ElMessage.info('表单已重置')
}

// 导出结果
const exportResults = () => {
  const data = {
    输入参数: {
      线电压: `${formData.voltage}V`,
      线电流: `${formData.current}A`,
      功率因数: formData.powerFactor
    },
    计算结果: {
      有功功率: `${results.activePower.toFixed(2)}kW`,
      无功功率: `${results.reactivePower.toFixed(2)}kvar`,
      视在功率: `${results.apparentPower.toFixed(2)}kVA`
    },
    计算时间: new Date().toLocaleString()
  }

  const dataStr = JSON.stringify(data, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `三相交流计算结果_${new Date().getTime()}.json`
  link.click()

  URL.revokeObjectURL(url)
  ElMessage.success('结果已导出')
}

// 分享结果
const shareResults = () => {
  const shareText = `三相交流电路计算结果：
输入 - 电压：${formData.voltage}V，电流：${formData.current}A，功率因数：${formData.powerFactor}
结果 - 有功功率：${results.activePower.toFixed(2)}kW，无功功率：${results.reactivePower.toFixed(2)}kvar，视在功率：${results.apparentPower.toFixed(2)}kVA`

  if (navigator.share) {
    navigator.share({
      title: '三相交流电路计算结果',
      text: shareText
    })
  } else {
    // 复制到剪贴板
    navigator.clipboard.writeText(shareText).then(() => {
      ElMessage.success('结果已复制到剪贴板')
    }).catch(() => {
      ElMessage.error('分享失败')
    })
  }
}
</script>

<style scoped>
.calculator {
  max-width: 900px;
  margin: 0 auto;
}

.calculator-card {
  margin-bottom: 20px;
  border-radius: 12px;
}

.results-card {
  border-radius: 12px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
}

.calculator-form {
  margin-top: 20px;
}

.button-row {
  margin-top: 24px;
  gap: 12px;
}

.calculation-process {
  background: #fafafa;
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
}

.result-actions {
  margin-top: 20px;
  gap: 12px;
}

/* 统计数字样式优化 */
:deep(.el-statistic) {
  text-align: center;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 16px;
}

:deep(.el-statistic__head) {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

:deep(.el-statistic__content) {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

/* 时间线样式 */
:deep(.el-timeline-item__timestamp) {
  color: #409EFF;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .calculator {
    padding: 0 8px;
  }

  .card-header {
    font-size: 14px;
  }

  .button-row {
    flex-direction: column;
    align-items: stretch;
  }

  .button-row .el-button {
    margin: 4px 0;
  }

  .result-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .result-actions .el-button {
    margin: 4px 0;
  }

  :deep(.el-statistic__content) {
    font-size: 20px;
  }

  .calculation-process {
    padding: 12px;
  }
}

/* 按钮动画效果 */
.el-button {
  transition: all 0.3s;
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
