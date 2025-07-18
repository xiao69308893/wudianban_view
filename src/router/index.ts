import { createRouter, createWebHistory } from 'vue-router'

// 导入页面组件
import CategoryView from '@/views/CategoryView.vue'
import ToolListView from '@/views/ToolListView.vue'
import ToolView from '@/views/ToolView.vue'
import ToolAdminView from '@/views/ToolAdminView.vue'

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
      meta: {
        title: '工具分类 - 电气计算工具平台',
        breadcrumb: '首页'
      }
    },
    {
      path: '/category/:categoryId',
      name: 'category',
      component: ToolListView,
      props: route => ({
        categoryId: parseInt(route.params.categoryId as string)
      }),
      meta: {
        title: '工具列表 - 电气计算工具平台',
        breadcrumb: '工具列表'
      }
    },
    {
      path: '/category/:categoryId/tool/:toolId',
      name: 'tool',
      component: ToolView,
      props: route => ({
        categoryId: parseInt(route.params.categoryId as string),
        toolId: parseInt(route.params.toolId as string)
      }),
      meta: {
        title: '计算工具 - 电气计算工具平台',
        breadcrumb: '工具详情'
      }
    },
    {
      path: '/admin/tools',
      name: 'tool-admin',
      component: ToolAdminView,
      meta: {
        title: '工具管理 - 电气计算工具平台',
        requiresAuth: true, // 需要管理员权限
        breadcrumb: '工具管理'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: {
        title: '用户登录 - 电气计算工具平台',
        breadcrumb: '登录'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: {
        title: '关于我们 - 电气计算工具平台',
        breadcrumb: '关于我们'
      }
    },
    // 404 页面
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: {
        title: '页面未找到 - 电气计算工具平台',
        breadcrumb: '页面未找到'
      }
    }
  ],
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    // 这里可以添加认证逻辑
    // 例如检查用户是否登录、是否有管理员权限等
    const isAuthenticated = checkUserAuth()
    const isAdmin = checkAdminRole()

    if (!isAuthenticated) {
      next('/login')
      return
    }

    if (!isAdmin) {
      alert('您没有访问此页面的权限')
      next('/')
      return
    }
  }

  // 路由参数验证
  if (to.name === 'category' || to.name === 'tool') {
    const categoryId = parseInt(to.params.categoryId as string)

    // 验证分类ID是否有效
    if (isNaN(categoryId) || categoryId < 1 || categoryId > 6) {
      next('/404')
      return
    }
  }

  if (to.name === 'tool') {
    const toolId = parseInt(to.params.toolId as string)

    // 验证工具ID是否有效
    if (isNaN(toolId) || toolId < 1) {
      next('/404')
      return
    }
  }

  next()
})

// 检查用户认证状态（示例函数）
function checkUserAuth(): boolean {
  // 这里应该检查实际的认证状态
  // 例如检查localStorage中的token或调用API验证
  return localStorage.getItem('user_token') !== null
}

// 检查管理员角色（示例函数）
function checkAdminRole(): boolean {
  // 这里应该检查用户是否有管理员权限
  // 例如检查用户角色或权限列表
  const userRole = localStorage.getItem('user_role')
  return userRole === 'admin' || userRole === 'super_admin'
}

// 全局后置守卫 - 用于页面访问统计等
router.afterEach((to, from) => {
  // 记录页面访问统计
  console.log(`用户从 ${from.path} 跳转到 ${to.path}`)

  // 可以在这里添加页面访问统计、埋点等逻辑
  if (to.name === 'tool') {
    // 记录工具访问次数
    const toolId = to.params.toolId
    console.log(`用户访问了工具 ${toolId}`)
    // 这里可以调用API记录访问统计
  }
})

export default router
