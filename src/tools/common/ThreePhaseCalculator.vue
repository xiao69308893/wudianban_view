<template>
  <div class="calculator">
    <h2>三相交流电路计算器</h2>

    <div class="input-group">
      <label>线电压 (V):</label>
      <input v-model="voltage" type="number" />
    </div>

    <div class="input-group">
      <label>线电流 (A):</label>
      <input v-model="current" type="number" />
    </div>

    <div class="input-group">
      <label>功率因数:</label>
      <input v-model="powerFactor" type="number" min="0" max="1" step="0.01" />
    </div>

    <div class="results">
      <div class="result-item">
        <span>有功功率 (kW):</span>
        <span>{{ activePower.toFixed(2) }}</span>
      </div>
      <div class="result-item">
        <span>无功功率 (kvar):</span>
        <span>{{ reactivePower.toFixed(2) }}</span>
      </div>
      <div class="result-item">
        <span>视在功率 (kVA):</span>
        <span>{{ apparentPower.toFixed(2) }}</span>
      </div>
    </div>

    <button @click="calculate" class="calculate-btn">计算</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const voltage = ref(380)
const current = ref(10)
const powerFactor = ref(0.8)

const activePower = computed(() => {
  return (Math.sqrt(3) * voltage.value * current.value * powerFactor.value) / 1000
})

const reactivePower = computed(() => {
  const sinPhi = Math.sqrt(1 - Math.pow(powerFactor.value, 2))
  return (Math.sqrt(3) * voltage.value * current.value * sinPhi) / 1000
})

const apparentPower = computed(() => {
  return (Math.sqrt(3) * voltage.value * current.value) / 1000
})

const calculate = () => {
  // 触发计算事件，将结果发送给父组件
  emit('calculate', {
    toolId: 'three-phase',
    inputs: {
      voltage: voltage.value,
      current: current.value,
      powerFactor: powerFactor.value,
    },
    result: {
      activePower: activePower.value,
      reactivePower: reactivePower.value,
      apparentPower: apparentPower.value,
    },
  })
}

const emit = defineEmits(['calculate'])
</script>

<style scoped>
.calculator {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.results {
  margin: 20px 0;
}

.result-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.calculate-btn {
  width: 100%;
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.calculate-btn:hover {
  background-color: #2980b9;
}
</style>
