import { createWebHashHistory, createRouter } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import MapView from '@/views/MapView.vue'
import GuideView from '@/views/GuideView.vue'
import LeaderboardView from '@/views/LeaderboardView.vue'
import AboutView from '@/views/AboutView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/map', name: 'map', component: MapView },
  { path: '/leaderboard', name: 'leaderboard', component: LeaderboardView },
  { path: '/guide', name: 'guide', component: GuideView },
  { path: '/guide/:section', name: 'guide-section', component: GuideView },
  { path: '/guide/:section/:sub', name: 'guide-subsection', component: GuideView },
  { path: '/about', name: 'about', component: AboutView },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
