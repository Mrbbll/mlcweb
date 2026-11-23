<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const scrolled = ref(false)
const logoUrl = `${import.meta.env.BASE_URL}server-logo.png`

const transparentRoutes = ['home']
const isTransparent = computed(() => transparentRoutes.includes(route.name) && !scrolled.value)

const navItems = [
  { path: '/', label: '首页' },
  { path: '/map', label: '在线地图' },
  { path: '/guide', label: '玩法指南' },
  { path: '/leaderboard', label: '排行榜' },
  { path: '/about', label: '关于我们' },
]

function isActive(item) {
  if (item.path === '/') return route.path === '/'
  return route.path === item.path || route.path.startsWith(`${item.path}/`)
}

function onScroll() {
  scrolled.value = window.scrollY > 40
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header class="site-header" :class="{ 'is-transparent': isTransparent }">
    <div class="header-inner">
      <router-link class="brand" to="/" aria-label="MLC 首页">
        <img class="brand-logo" :src="logoUrl" width="72" height="72" alt=""><span>MLC</span>
      </router-link>
      <nav class="site-nav" aria-label="主导航">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="{ 'is-nav-active': isActive(item) }"
        >{{ item.label }}</router-link>
      </nav>
    </div>
  </header>
</template>
