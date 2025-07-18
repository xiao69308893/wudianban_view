// 工具配置系统 - 统一管理所有计算工具

export interface ToolFormula {
  name: string
  expression: string
  description: string
}

export interface ToolExample {
  title: string
  inputs: string
  result: string
  inputValues?: Record<string, any>
}

export interface ToolConfig {
  id: number
  name: string
  description: string
  icon: string
  categoryId: number
  component: string // 组件路径
  usageCount: number
  rating: number
  ratingCount: number
  isNew: boolean
  isPopular: boolean
  lastUpdated: string

  // 工具文档
  quickGuide: string[]
  formulas: ToolFormula[]
  examples: ToolExample[]
  notes: string[]

  // 功能特性
  features: string[]

  // 元数据
  author?: string
  version?: string
  tags?: string[]
}

export interface CategoryConfig {
  id: number
  name: string
  description: string
  icon: string
  toolCount: number
  usageCount: number
}

// 分类配置
export const categoriesConfig: CategoryConfig[] = [
  {
    id: 1,
    name: '常用计算',
    description: '电压、电流、功率等基础电气参数计算工具',
    icon: '⚡',
    toolCount: 0, // 动态计算
    usageCount: 12547
  },
  {
    id: 2,
    name: '负荷计算',
    description: '设备负荷、用电量、需用系数等计算工具',
    icon: '📊',
    toolCount: 0,
    usageCount: 8934
  },
  {
    id: 3,
    name: '短路计算',
    description: '短路电流、保护设备选择等安全计算工具',
    icon: '⚠️',
    toolCount: 0,
    usageCount: 6721
  },
  {
    id: 4,
    name: '电压降计算',
    description: '线路电压降、补偿计算等配电计算工具',
    icon: '📉',
    toolCount: 0,
    usageCount: 5432
  },
  {
    id: 5,
    name: '电缆选择',
    description: '电缆截面、载流量、选型等计算工具',
    icon: '🔌',
    toolCount: 0,
    usageCount: 9876
  },
  {
    id: 6,
    name: '照明计算',
    description: '照度计算、灯具布置、节能分析工具',
    icon: '💡',
    toolCount: 0,
    usageCount: 4567
  }
]

// 工具配置
export const toolsConfig: ToolConfig[] = [
  {
    id: 1,
    name: '三相功率计算器',
    description: '计算三相交流电路的有功功率、无功功率和视在功率',
    icon: '⚡',
    categoryId: 1,
    component: 'ThreePhaseCalculator',
    usageCount: 1523,
    rating: 4.8,
    ratingCount: 234,
    isNew: false,
    isPopular: true,
    lastUpdated: '2025-01-15',
    features: ['三相电路', '功率计算', '实时结果'],
    quickGuide: [
      '输入线电压值（单位：伏特）',
      '输入线电流值（单位：安培）',
      '选择功率因数（0-1之间）',
      '选择连接方式（星形或三角形）',
      '点击计算按钮获得结果'
    ],
    formulas: [
      {
        name: '三相有功功率',
        expression: 'P = √3 × U × I × cosφ',
        description: '其中P为有功功率(W)，U为线电压(V)，I为线电流(A)，cosφ为功率因数'
      },
      {
        name: '三相无功功率',
        expression: 'Q = √3 × U × I × sinφ',
        description: '其中Q为无功功率(Var)，sinφ = √(1 - cos²φ)'
      },
      {
        name: '三相视在功率',
        expression: 'S = √3 × U × I',
        description: '其中S为视在功率(VA)'
      }
    ],
    examples: [
      {
        title: '工厂电机负荷计算',
        inputs: '线电压: 380V, 线电流: 50A, 功率因数: 0.85',
        result: '有功功率: 27.96kW, 无功功率: 17.36kVar, 视在功率: 32.91kVA',
        inputValues: { voltage: 380, current: 50, powerFactor: 0.85 }
      },
      {
        title: '办公楼照明负荷',
        inputs: '线电压: 220V, 线电流: 15A, 功率因数: 0.9',
        result: '有功功率: 5.15kW, 无功功率: 2.29kVar, 视在功率: 5.72kVA',
        inputValues: { voltage: 220, current: 15, powerFactor: 0.9 }
      }
    ],
    notes: [
      '请确保输入的电压和电流值在合理范围内',
      '功率因数通常在0.7-0.95之间，具体值需根据负荷性质确定',
      '计算结果仅供参考，实际应用请咨询专业电气工程师'
    ],
    author: '系统管理员',
    version: '1.0.0',
    tags: ['三相', '功率', '电路分析']
  },
  {
    id: 2,
    name: '单相功率计算器',
    description: '计算单相交流电路的功率参数和电气量',
    icon: '🔌',
    categoryId: 1,
    component: 'SinglePhaseCalculator',
    usageCount: 956,
    rating: 4.6,
    ratingCount: 189,
    isNew: false,
    isPopular: false,
    lastUpdated: '2025-01-10',
    features: ['单相电路', '基础计算', '快速便捷'],
    quickGuide: [
      '输入电压值（单位：伏特）',
      '输入电流值（单位：安培）',
      '输入功率因数（0-1之间）',
      '点击计算按钮获得结果'
    ],
    formulas: [
      {
        name: '单相有功功率',
        expression: 'P = U × I × cosφ',
        description: '其中P为有功功率(W)，U为电压(V)，I为电流(A)，cosφ为功率因数'
      },
      {
        name: '单相无功功率',
        expression: 'Q = U × I × sinφ',
        description: '其中Q为无功功率(Var)，sinφ = √(1 - cos²φ)'
      },
      {
        name: '单相视在功率',
        expression: 'S = U × I',
        description: '其中S为视在功率(VA)'
      }
    ],
    examples: [
      {
        title: '家用电器功率计算',
        inputs: '电压: 220V, 电流: 5A, 功率因数: 0.8',
        result: '有功功率: 880W, 无功功率: 660Var, 视在功率: 1100VA',
        inputValues: { voltage: 220, current: 5, powerFactor: 0.8 }
      }
    ],
    notes: [
      '单相电路计算相对简单，适用于家用电器和小型设备',
      '功率因数对于阻性负载接近1，对于感性负载会降低'
    ],
    author: '系统管理员',
    version: '1.0.0',
    tags: ['单相', '功率', '基础计算']
  },
  {
    id: 3,
    name: '欧姆定律计算器',
    description: '根据欧姆定律计算电压、电流、电阻之间的关系',
    icon: 'Ω',
    categoryId: 1,
    component: 'OhmLawCalculator',
    usageCount: 2134,
    rating: 4.9,
    ratingCount: 456,
    isNew: false,
    isPopular: true,
    lastUpdated: '2025-01-12',
    features: ['欧姆定律', '基础公式', '教学工具'],
    quickGuide: [
      '选择要计算的物理量（电压、电流或电阻）',
      '输入已知的两个参数',
      '点击计算按钮获得第三个参数',
      '查看功率计算结果'
    ],
    formulas: [
      {
        name: '欧姆定律',
        expression: 'U = I × R',
        description: '电压(V) = 电流(A) × 电阻(Ω)'
      },
      {
        name: '功率公式',
        expression: 'P = U × I = I² × R = U² / R',
        description: '功率(W)的三种计算方式'
      }
    ],
    examples: [
      {
        title: '电阻器参数计算',
        inputs: '电压: 12V, 电流: 0.5A',
        result: '电阻: 24Ω, 功率: 6W',
        inputValues: { voltage: 12, current: 0.5 }
      },
      {
        title: 'LED灯电路分析',
        inputs: '电压: 3.3V, 电阻: 330Ω',
        result: '电流: 10mA, 功率: 33mW',
        inputValues: { voltage: 3.3, resistance: 330 }
      }
    ],
    notes: [
      '欧姆定律适用于线性电阻元件',
      '对于非线性元件（如二极管），此公式不完全适用',
      '计算功率时要注意元件的额定功率'
    ],
    author: '系统管理员',
    version: '1.1.0',
    tags: ['欧姆定律', '基础', '教学']
  }
  // 可以继续添加更多工具配置...
]

// 工具管理函数
export class ToolManager {
  // 获取所有工具
  static getAllTools(): ToolConfig[] {
    return [...toolsConfig]
  }

  // 根据分类获取工具
  static getToolsByCategory(categoryId: number): ToolConfig[] {
    return toolsConfig.filter(tool => tool.categoryId === categoryId)
  }

  // 根据ID获取工具
  static getToolById(id: number): ToolConfig | undefined {
    return toolsConfig.find(tool => tool.id === id)
  }

  // 获取所有分类
  static getAllCategories(): CategoryConfig[] {
    // 更新分类的工具数量
    return categoriesConfig.map(category => ({
      ...category,
      toolCount: this.getToolsByCategory(category.id).length
    }))
  }

  // 根据ID获取分类
  static getCategoryById(id: number): CategoryConfig | undefined {
    const categories = this.getAllCategories()
    return categories.find(category => category.id === id)
  }

  // 搜索工具
  static searchTools(query: string): ToolConfig[] {
    const lowerQuery = query.toLowerCase()
    return toolsConfig.filter(tool =>
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.features.some(feature => feature.toLowerCase().includes(lowerQuery)) ||
      tool.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  // 获取热门工具
  static getPopularTools(limit = 6): ToolConfig[] {
    return toolsConfig
      .filter(tool => tool.isPopular)
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit)
  }

  // 获取新工具
  static getNewTools(limit = 6): ToolConfig[] {
    return toolsConfig
      .filter(tool => tool.isNew)
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, limit)
  }

  // 获取推荐工具（基于分类）
  static getRecommendedTools(excludeToolId: number, categoryId?: number, limit = 3): ToolConfig[] {
    let candidates = toolsConfig.filter(tool => tool.id !== excludeToolId)

    if (categoryId) {
      // 优先推荐同分类的工具
      const sameCategory = candidates.filter(tool => tool.categoryId === categoryId)
      const otherCategory = candidates.filter(tool => tool.categoryId !== categoryId)

      candidates = [...sameCategory, ...otherCategory]
    }

    return candidates
      .sort((a, b) => (b.rating * b.usageCount) - (a.rating * a.usageCount))
      .slice(0, limit)
  }

  // 添加新工具
  static addTool(toolConfig: Omit<ToolConfig, 'id' | 'usageCount' | 'rating' | 'ratingCount' | 'lastUpdated'>): ToolConfig {
    const newId = Math.max(...toolsConfig.map(t => t.id)) + 1
    const newTool: ToolConfig = {
      ...toolConfig,
      id: newId,
      usageCount: 0,
      rating: 0,
      ratingCount: 0,
      lastUpdated: new Date().toISOString().split('T')[0]
    }

    toolsConfig.push(newTool)
    return newTool
  }

  // 更新工具
  static updateTool(id: number, updates: Partial<ToolConfig>): ToolConfig | null {
    const index = toolsConfig.findIndex(tool => tool.id === id)
    if (index === -1) return null

    toolsConfig[index] = {
      ...toolsConfig[index],
      ...updates,
      lastUpdated: new Date().toISOString().split('T')[0]
    }

    return toolsConfig[index]
  }

  // 删除工具
  static deleteTool(id: number): boolean {
    const index = toolsConfig.findIndex(tool => tool.id === id)
    if (index === -1) return false

    toolsConfig.splice(index, 1)
    return true
  }

  // 更新工具使用统计
  static incrementUsage(id: number): void {
    const tool = this.getToolById(id)
    if (tool) {
      tool.usageCount++
    }
  }

  // 更新工具评分
  static updateRating(id: number, rating: number): void {
    const tool = this.getToolById(id)
    if (tool) {
      const totalRating = tool.rating * tool.ratingCount + rating
      tool.ratingCount++
      tool.rating = Math.round((totalRating / tool.ratingCount) * 10) / 10
    }
  }

  // 批量导入工具
  static importTools(tools: ToolConfig[]): void {
    tools.forEach(tool => {
      // 检查ID冲突
      if (this.getToolById(tool.id)) {
        tool.id = Math.max(...toolsConfig.map(t => t.id)) + 1
      }
      toolsConfig.push(tool)
    })
  }

  // 导出工具配置
  static exportTools(): string {
    return JSON.stringify(toolsConfig, null, 2)
  }

  // 验证工具配置
  static validateTool(tool: Partial<ToolConfig>): string[] {
    const errors: string[] = []

    if (!tool.name || tool.name.trim().length === 0) {
      errors.push('工具名称不能为空')
    }

    if (!tool.description || tool.description.trim().length === 0) {
      errors.push('工具描述不能为空')
    }

    if (!tool.icon || tool.icon.trim().length === 0) {
      errors.push('工具图标不能为空')
    }

    if (!tool.categoryId || !this.getCategoryById(tool.categoryId)) {
      errors.push('必须选择有效的工具分类')
    }

    if (!tool.component || tool.component.trim().length === 0) {
      errors.push('必须指定组件名称')
    }

    if (!tool.quickGuide || tool.quickGuide.length === 0) {
      errors.push('必须提供快速指南')
    }

    if (!tool.formulas || tool.formulas.length === 0) {
      errors.push('必须提供计算公式')
    }

    return errors
  }
}

// 默认导出
export default {
  toolsConfig,
  categoriesConfig,
  ToolManager
}
