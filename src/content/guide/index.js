import welcome from './welcome.md?raw'
import rules from './rules.md?raw'
import client from './client.md?raw'
import survival from './survival.md?raw'
import recipes from './survival/recipes.md?raw'
import commands from './survival/commands.md?raw'
import mechanics from './survival/mechanics.md?raw'
import multiblock from './survival/multiblock.md?raw'
import claims from './survival/claims.md?raw'
import shop from './survival/shop.md?raw'
import features from './survival/features.md?raw'

export const guideSections = [
  { id: 'welcome', title: '欢迎来到 MLC', path: '/guide', content: welcome },
  { id: 'rules', title: '入服守则', path: '/guide/rules', content: rules },
  { id: 'client', title: '客户端安装', path: '/guide/client', content: client },
  {
    id: 'survival',
    title: '生存服',
    path: '/guide/survival',
    content: survival,
    children: [
      { id: 'recipes', title: '特殊配方', path: '/guide/survival/recipes', content: recipes },
      { id: 'commands', title: '主要命令', path: '/guide/survival/commands', content: commands },
      { id: 'mechanics', title: '特殊机制', path: '/guide/survival/mechanics', content: mechanics },
      { id: 'multiblock', title: '多方块结构', path: '/guide/survival/multiblock', content: multiblock },
      { id: 'claims', title: '圈区块系统', path: '/guide/survival/claims', content: claims },
      { id: 'features', title: '经济、邮件与物品', path: '/guide/survival/features', content: features },
      { id: 'shop', title: '建筑商店', path: '/guide/survival/shop', content: shop },
    ],
  },
]

export const guidePages = guideSections.flatMap(section => [
  section,
  ...(section.children || []).map(child => ({ ...child, parentId: section.id })),
])
