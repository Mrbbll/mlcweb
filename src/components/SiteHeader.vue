<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { guideUrl } from '@/site-config'

const route = useRoute()
const scrolled = ref(false)

const isTransparent = computed(() => route.name === 'home' && !scrolled.value)

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
        <img class="brand-logo" src="/server-logo.png" width="72" height="72" alt=""><span>MLC</span>
      </router-link>
      <nav class="site-nav" aria-label="主导航">
        <router-link to="/">首页</router-link>
        <router-link to="/map">在线地图</router-link>
        <a :href="guideUrl">玩法指南</a>
        <router-link to="/about">关于我们</router-link>
      </nav>
    </div>
  </header>
</template>
