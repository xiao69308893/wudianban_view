// 工具配置 - 统一管理所有计算工具

// export interface Tool {
//   id: string
//   name: string
//   categoryId: string
//   component: any // Vue 组件
//   description: string
//   example: string
// }
//
// // 所有工具配置
// const tools: Tool[] = [
//   {
//     id: 'three-phase',
//     name: '三相交流计算',
//     categoryId: 'common',
//     component: () => import('@/tools/common/ThreePhaseCalculator.vue'),
//     description: '用于计算三相交流电路中的电压、电流、功率等参数。公式：P = √3 × U × I × cosφ',
//     example:
//       '例如：计算380V电压，10A电流，功率因数0.8时的有功功率：P = √3 × 380 × 10 × 0.8 ≈ 5.26kW',
//   },
// ]

export interface ToolConfig {
  id: number;
  name: string;
  categoryId: number;
  component: string;
  documentation: string;
}

export const toolsConfig: ToolConfig[] = [
  {
    id: 'three-phase',
    name: '三相交流计算',
    categoryId: 'common',
    component: () => import('@/tools/common/ThreePhaseCalculator.vue'),
    description: '用于计算三相交流电路中的电压、电流、功率等参数。公式：P = √3 × U × I × cosφ',
    example:
      '例如：计算380V电压，10A电流，功率因数0.8时的有功功率：P = √3 × 380 × 10 × 0.8 ≈ 5.26kW',
  },
];

// 添加根据类别ID获取工具的函数
export function getToolsByCategory(categoryId: number): ToolConfig[] {
  return toolsConfig.filter(tool => tool.categoryId === categoryId);
}

// 添加获取类别名称的函数
export function getCategoryName(categoryId: number): string {
  const categories: Record<number, string> = {
    1: '常用计算',
    2: '负荷计算',
    3: '短路计算',
    4: '电压降计算',
    5: '电缆选择',
    6: '照明计算'
  };
  return categories[categoryId] || '未知类别';
}

export default toolsConfig
