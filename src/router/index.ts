import { createRouter, createWebHistory } from 'vue-router'
import CategoryView from '@/views/CategoryView.vue'
import ToolListView from '@/views/ToolListView.vue'
import ToolView from '@/views/ToolView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/categories',
    },
    {
      path: '/categories',
      name: 'categories',
      component: CategoryView,
    },
    {
      path: '/category/:categoryId',
      name: 'category',
      component: ToolListView,
      props: true,
    },
    {
      path: '/category/:categoryId/tool/:toolId',
      name: 'tool',
      component: ToolView,
      props: true,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
  ],
})

export default router
