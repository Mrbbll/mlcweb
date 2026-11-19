<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const scrolled = ref(false)
const logoUrl = `${import.meta.env.BASE_URL}server-logo.png`

const transparentRoutes = ['home', 'about']
const isTransparent = computed(() => transparentRoutes.includes(route.name) && !scrolled.value)

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
        <router-link to="/">首页</router-link>
        <router-link to="/map">在线地图</router-link>
        <router-link to="/guide">玩法指南</router-link>
        <router-link to="/leaderboard">排行榜</router-link>
        <router-link to="/about">关于我们</router-link>
      </nav>
    </div>
  </header>
</template>
