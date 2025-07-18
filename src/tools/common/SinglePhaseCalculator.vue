<template>
  <div class="calculator">
    <div class="calculator-header">
      <h3>单相功率计算器</h3>
      <p class="calculator-desc">计算单相交流电路的功率参数</p>
    </div>

    <div class="input-section">
      <div class="input-group">
        <label for="voltage">电压 (V)</label>
        <div class="input-wrapper">
          <input
            id="voltage"
            v-model.number="inputs.voltage"
            type="number"
            min="0"
            step="0.1"
            placeholder="输入电压值"
          >
          <span class="unit">V</span>
        </div>
      </div>

      <div class="input-group">
        <label for="current">电流 (A)</label>
        <div class="input-wrapper">
          <input
            id="current"
            v-model.number="inputs.current"
            type="number"
            min="0"
            step="0.01"
            placeholder="输入电流值"
          >
          <span class="unit">A</span>
        </div>
      </div>

      <div class="input-group">
        <label for="powerFactor">功率因数</label>
        <div class="input-wrapper">
          <input
            id="powerFactor"
            v-model.number="inputs.powerFactor"
            type="number"
            min="0"
            max="1"
            step="0.01"
            placeholder="输入功率因数"
          >
          <span class="unit">cosφ</span>
        </div>
        <div class="input-help">
          <small>功率因数范围：0-1，纯阻性负载为1</small>
        </div>
      </div>
    </div>

    <div class="control-section">
      <button @click="calculate" class="calculate-btn" :disabled="!canCalculate">
        <span class="btn-icon">⚡</span>
        计算功率
      </button>
      <button @click="reset" class="reset-btn">
        <span class="btn-icon">🔄</span>
        重置
      </button>
    </div>

    <div class="results-section" v-if="results.calculated">
      <h4>计算结果</h4>

      <div class="results-grid">
        <div class="result-card active-power">
          <div class="result-icon">⚡</div>
          <div class="result-content">
            <span class="result-label">有功功率</span>
            <span class="result-value">{{ results.activePower.toFixed(2) }}</span>
            <span class="result-unit">W</span>
          </div>
        </div>

        <div class="result-card reactive-power">
          <div class="result-icon">🔋</div>
          <div class="result-content">
            <span class="result-label">无功功率</span>
            <span class="result-value">{{ results.reactivePower.toFixed(2) }}</span>
            <span class="result-unit">Var</span>
          </div>
        </div>

        <div class="result-card apparent-power">
          <div class="result-icon">📊</div>
          <div class="result-content">
            <span class="result-label">视在功率</span>
            <span class="result-value">{{ results.apparentPower.toFixed(2) }}</span>
            <span class="result-unit">VA</span>
          </div>
        </div>

        <div class="result-card power-angle">
          <div class="result-icon">📐</div>
          <div class="result-content">
            <span class="result-label">功率角</span>
            <span class="result-value">{{ results.powerAngle.toFixed(1) }}</span>
            <span class="result-unit">°</span>
          </div>
        </div>
      </div>

      <div class="result-summary">
        <div class="summary-item">
          <strong>电阻:</strong> {{ results.resistance.toFixed(2) }} Ω
        </div>
        <div class="summary-item">
          <strong>阻抗:</strong> {{ results.impedance.toFixed(2) }} Ω
        </div>
        <div class="summary-item">
          <strong>电流有效值:</strong> {{ inputs.current }} A
        </div>
      </div>

      <div class="power-triangle" v-if="showPowerTriangle">
        <h5>功率三角形</h5>
        <div class="triangle-container">
          <svg viewBox="0 0 300 200" class="triangle-svg">
            <!-- 功率三角形 -->
            <polygon
              :points="trianglePoints"
              fill="rgba(102, 126, 234, 0.1)"
              stroke="#667eea"
              stroke-width="2"
            />

            <!-- 标签 -->
            <text x="20" y="180" class="triangle-label">P ({{ results.activePower.toFixed(0) }}W)</text>
            <text x="120" y="30" class="triangle-label">S ({{ results.apparentPower.toFixed(0) }}VA)</text>
            <text x="200" y="105" class="triangle-label">Q ({{ results.reactivePower.toFixed(0) }}Var)</text>

            <!-- 角度标记 -->
            <path
              d="M 20 170 A 20 20 0 0 0 40 155"
              fill="none"
              stroke="#ff6b6b"
              stroke-width="2"
            />
            <text x="45" y="165" class="angle-label">φ = {{ results.powerAngle.toFixed(1) }}°</text>
          </svg>
        </div>
      </div>
    </div>

    <!-- 输入验证提示 -->
    <div class="validation-messages" v-if="validationErrors.length > 0">
      <div class="error-message" v-for="error in validationErrors" :key="error">
        <span class="error-icon">⚠️</span>
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// 输入数据
const inputs = ref({
  voltage: 220,
  current: 5,
  powerFactor: 0.8
})

// 计算结果
const results = ref({
  calculated: false,
  activePower: 0,
  reactivePower: 0,
  apparentPower: 0,
  powerAngle: 0,
  resistance: 0,
  impedance: 0
})

// 显示功率三角形
const showPowerTriangle = ref(true)

// 验证错误
const validationErrors = ref<string[]>([])

// 组件通信
const emit = defineEmits(['calculate'])

// 计算属性
const canCalculate = computed(() => {
  return inputs.value.voltage > 0 &&
    inputs.value.current > 0 &&
    inputs.value.powerFactor >= 0 &&
    inputs.value.powerFactor <= 1
})

// 功率三角形坐标
const trianglePoints = computed(() => {
  if (!results.value.calculated) return "20,170 20,170 20,170"

  const scale = 150 / Math.max(results.value.apparentPower, 100)
  const pLength = results.value.activePower * scale
  const qLength = results.value.reactivePower * scale

  return `20,170 ${20 + pLength},170 ${20 + pLength},${170 - qLength}`
})

// 验证输入
const validateInputs = () => {
  const errors: string[] = []

  if (inputs.value.voltage <= 0) {
    errors.push('电压必须大于0')
  }

  if (inputs.value.current <= 0) {
    errors.push('电流必须大于0')
  }

  if (inputs.value.powerFactor < 0 || inputs.value.powerFactor > 1) {
    errors.push('功率因数必须在0-1之间')
  }

  if (inputs.value.voltage > 1000) {
    errors.push('电压值过大，请检查输入')
  }

  if (inputs.value.current > 1000) {
    errors.push('电流值过大，请检查输入')
  }

  validationErrors.value = errors
  return errors.length === 0
}

// 执行计算
const calculate = () => {
  if (!validateInputs()) return

  const { voltage, current, powerFactor } = inputs.value

  // 计算功率参数
  const activePower = voltage * current * powerFactor
  const apparentPower = voltage * current
  const reactivePower = Math.sqrt(Math.pow(apparentPower, 2) - Math.pow(activePower, 2))
  const powerAngle = Math.acos(powerFactor) * (180 / Math.PI)

  // 计算电路参数
  const resistance = activePower / Math.pow(current, 2)
  const impedance = voltage / current

  results.value = {
    calculated: true,
    activePower,
    reactivePower,
    apparentPower,
    powerAngle,
    resistance,
    impedance
  }

  // 发送计算事件给父组件
  emit('calculate', {
    toolId: 'single-phase',
    inputs: { ...inputs.value },
    result: { ...results.value }
  })
}

// 重置计算器
const reset = () => {
  inputs.value = {
    voltage: 220,
    current: 5,
    powerFactor: 0.8
  }

  results.value = {
    calculated: false,
    activePower: 0,
    reactivePower: 0,
    apparentPower: 0,
    powerAngle: 0,
    resistance: 0,
    impedance: 0
  }

  validationErrors.value = []
}

// 加载输入数据（用于历史记录）
const loadInputs = (inputData: any) => {
  inputs.value = { ...inputData }
  calculate()
}

// 加载示例数据
const loadExample = (example: any) => {
  if (example.inputValues) {
    inputs.value = { ...example.inputValues }
    calculate()
  }
}

// 监听输入变化，自动验证
watch(inputs, () => {
  if (results.value.calculated) {
    validateInputs()
  }
}, { deep: true })

// 暴露方法给父组件
defineExpose({
  reset,
  loadInputs,
  loadExample,
  calculate
})
</script>

<style scoped>
.calculator {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.calculator-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f8f9fa;
}

.calculator-header h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.calculator-desc {
  color: #6c757d;
  margin: 0;
  font-size: 0.9rem;
}

.input-section {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  flex: 1;
  padding: 0.75rem 3rem 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

.input-wrapper input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-wrapper .unit {
  position: absolute;
  right: 1rem;
  color: #6c757d;
  font-weight: 500;
  font-size: 0.9rem;
}

.input-help {
  margin-top: 0.25rem;
}

.input-help small {
  color: #6c757d;
  font-size: 0.8rem;
}

.control-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
}

.calculate-btn, .reset-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.calculate-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.calculate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.calculate-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
}

.reset-btn {
  background: #f8f9fa;
  color: #495057;
  border: 2px solid #e9ecef;
}

.reset-btn:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1.1rem;
}

.results-section {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.results-section h4 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.3rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.result-card {
  background: white;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.result-card:hover {
  transform: translateY(-3px);
}

.result-card.active-power {
  border-left: 4px solid #28a745;
}

.result-card.reactive-power {
  border-left: 4px solid #ffc107;
}

.result-card.apparent-power {
  border-left: 4px solid #667eea;
}

.result-card.power-angle {
  border-left: 4px solid #ff6b6b;
}

.result-icon {
  font-size: 2rem;
  opacity: 0.8;
}

.result-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.result-label {
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.result-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
}

.result-unit {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
}

.result-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.summary-item {
  background: white;
  padding: 0.75rem;
  border-radius: 8px;
  text-align: center;
  font-size: 0.9rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.power-triangle {
  background: white;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
}

.power-triangle h5 {
  color: #495057;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.triangle-container {
  max-width: 300px;
  margin: 0 auto;
}

.triangle-svg {
  width: 100%;
  height: 200px;
}

.triangle-label {
  font-size: 12px;
  fill: #495057;
  font-weight: 600;
}

.angle-label {
  font-size: 11px;
  fill: #ff6b6b;
  font-weight: 600;
}

.validation-messages {
  margin-top: 1rem;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.error-icon {
  font-size: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .calculator {
    padding: 1.5rem;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }

  .control-section {
    flex-direction: column;
  }

  .calculate-btn, .reset-btn {
    width: 100%;
    justify-content: center;
  }

  .result-summary {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .calculator {
    padding: 1rem;
  }

  .calculator-header h3 {
    font-size: 1.3rem;
  }

  .result-value {
    font-size: 1.3rem;
  }
}
</style>
