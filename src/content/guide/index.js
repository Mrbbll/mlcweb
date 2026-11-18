import welcome from './welcome.md?raw'
import rules from './rules.md?raw'
import client from './client.md?raw'
import survival from './survival.md?raw'

export const guideSections = [
  { id: 'welcome', title: '欢迎来到 MLC', path: '/guide', content: welcome },
  { id: 'rules', title: '入服守则', path: '/guide/rules', content: rules },
  { id: 'client', title: '客户端安装', path: '/guide/client', content: client },
  { id: 'survival', title: '生存服', path: '/guide/survival', content: survival },
]
