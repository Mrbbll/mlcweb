import { createWebHistory, createRouter } from 'vue-router'

import Money from '../view/uilts/Money.vue'
import Map from '../view/layout/Map.vue'
import PlayerList from '../view/uilts/PlayerList.vue'

const routes = [
//   { path: '/', component: container },
//   { path: '/1', component: container },
  { path: '/2', name:'PlayerList', component: PlayerList },
  { path: '/3',name:'Map', component: Map },
  { path: '/4',name:'Money', component: Money },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
  });

export default router;
