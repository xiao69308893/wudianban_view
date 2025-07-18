<template>
  <div class="tool-category">
    <div class="category-header">
      <span class="icon">{{ category.icon }}</span>
      <h2>{{ category.name }}</h2>
    </div>
    <div class="tools-grid">
      <RouterLink
        v-for="tool in tools"
        :key="tool.id"
        :to="`/category/${category.id}/tool/${tool.id}`"
        class="tool-card"
      >
        <div class="tool-icon">{{ tool.icon }}</div>
        <h3>{{ tool.name }}</h3>
        <p>{{ tool.description }}</p>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  category: {
    type: Object as PropType<{ id: number; name: string; icon: string }>,
    required: true,
  },
})

// 示例工具数据 - 实际应从API获取
const tools = ref([
  {
    id: 1,
    name: '三相交流计算',
    description: '三相交流电路参数计算',
    icon: '🔋',
    categoryId: props.category.id,
  },
  {
    id: 2,
    name: '单相交流计算',
    description: '单相交流电路参数计算',
    icon: '🔌',
    categoryId: props.category.id,
  },
  // 添加更多工具
])
</script>

<style scoped>
.tool-category {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.category-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.tool-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.tool-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
</style>
