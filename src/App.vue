<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import MapView from '@/views/MapView.vue'

let clickFx = null
let alive = false
const tencentMobile = document.documentElement.classList.contains('tencent-mobile')

const handleRawPointerMove = event => {
  if (!clickFx || event.pointerType === 'touch') return
  clickFx.pointerMove({
    x: event.clientX,
    y: event.clientY,
    pointerId: event.pointerId,
    pointerType: event.pointerType,
  })
}

onMounted(async () => {
  alive = true
  if (tencentMobile) return
  const { BAClickFX } = await import('ba-click-fx')
  if (!alive) return
  clickFx = new BAClickFX({
    outputCompositing: 'browser-overlay',
    hostCompositing: 'screen',
    hostCompositingSurface: 'dom-backdrop',
  })
  clickFx.updateConfig({ trailAlways: true })
  if ('onpointerrawupdate' in window) {
    window.addEventListener('pointerrawupdate', handleRawPointerMove, { capture: true, passive: true })
  }
})

onBeforeUnmount(() => {
  alive = false
  window.removeEventListener('pointerrawupdate', handleRawPointerMove, true)
  clickFx?.destroy()
  clickFx = null
})

const route = useRoute()
const isMap = computed(() => route.name === 'map')
const showFooter = computed(() => route.name !== 'map')
const mapMounted = ref(false)

watch(isMap, value => {
  if (value) mapMounted.value = true
}, { immediate: true })
</script>

<template>
  <SiteHeader />
  <main class="site-main">
    <router-view v-if="!isMap" />
    <MapView v-if="mapMounted" v-show="isMap" />
  </main>
  <SiteFooter v-if="showFooter" />
</template>
