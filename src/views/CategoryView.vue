<template>
  <div class="category-view">
    <h1>电气计算工具</h1>
    <div class="category-grid">
      <ToolCategory v-for="category in categories" :key="category.id" :category="category" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ToolCategory from '@/components/ToolCategory.vue'

const categories = ref([
  { id: 1, name: '常用计算', icon: '⚡' },
  { id: 2, name: '负荷计算', icon: '🔌' },
  { id: 3, name: '短路计算', icon: '⚠️' },
  // 添加更多类别
])
</script>

<style scoped>
.category-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
</style>
