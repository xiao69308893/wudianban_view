<template>
  <div class="tool-view">
    <div class="calculator-container">
      <!-- 动态加载具体计算器组件 -->
      <component :is="currentCalculator" />
    </div>

    <div class="documentation">
      <h2>计算说明</h2>
      <div v-html="toolDocumentation"></div>
    </div>

    <CommentSection :toolId="toolId" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import CommentSection from '@/components/CommentSection.vue'

const route = useRoute()
const toolId = computed(() => parseInt(route.params.toolId as string))

// 根据toolId加载对应的计算器组件和文档
const currentCalculator = computed(() => {
  // 实际项目中应根据toolId动态导入
  // 例如: return defineAsyncComponent(() => import(`@/tools/${toolId.value}.vue`))
  return null // 占位符
})

const toolDocumentation = ref(`
  <h3>计算公式</h3>
  <p>功率公式: P = U × I × cosφ</p>
  <p>电流公式: I = P / (U × cosφ)</p>
  
  <h3>使用说明</h3>
  <ol>
    <li>输入电压值（单位：伏特）</li>
    <li>输入电流值（单位：安培）</li>
    <li>输入功率因数（0-1之间）</li>
    <li>点击"计算"按钮获取结果</li>
  </ol>
  
  <h3>示例</h3>
  <p>电压: 220V, 电流: 10A, 功率因数: 0.9 → 功率 = 220 × 10 × 0.9 = 1980W</p>
`)
</script>

<style scoped>
.tool-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.calculator-container {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.documentation {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
