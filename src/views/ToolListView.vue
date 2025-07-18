<template>
  <div class="tool-list-view">
    <h1>{{ categoryName }}</h1>
    <div class="tool-grid">
      <div v-for="tool in tools" :key="tool.id" class="tool-card" @click="goToTool(tool.id)">
        <div class="tool-icon">{{ tool.icon }}</div>
        <div class="tool-name">{{ tool.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getToolsByCategory } from '@/tools/tools.config'

const route = useRoute()
const router = useRouter()
const categoryId = parseInt(route.params.categoryId as string)

const tools = computed(() => getToolsByCategory(categoryId))
const categoryName = computed(() => {
  const categories = [
    { id: 1, name: '常用计算' },
    { id: 2, name: '负荷计算' },
    { id: 3, name: '短路计算' },
  ]
  return categories.find((c) => c.id === categoryId)?.name || '未知类别'
})

function goToTool(toolId: number) {
  router.push({ name: 'tool', params: { toolId } })
}
</script>

<style scoped>
.tool-list-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.tool-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.tool-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.tool-name {
  font-weight: 500;
}
</style>
