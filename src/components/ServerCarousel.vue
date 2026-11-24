<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const baseUrl = import.meta.env.BASE_URL
const tencentMobile = document.documentElement.classList.contains('tencent-mobile')

const slides = [
  { src: `${baseUrl}pics/server-01.jpg`, mobile: `${baseUrl}pics/server-01-960.webp`, alt: 'MLC 服务器图片 1' },
  { src: `${baseUrl}pics/server-02.png`, mobile: `${baseUrl}pics/server-02-960.webp`, alt: 'MLC 服务器图片 2' },
  { src: `${baseUrl}pics/server-03.png`, mobile: `${baseUrl}pics/server-03-960.webp`, alt: 'MLC 服务器图片 3' },
  { src: `${baseUrl}pics/server-04.png`, mobile: `${baseUrl}pics/server-04-960.webp`, alt: 'MLC 服务器图片 4' },
]

const slideSrc = slide => tencentMobile ? slide.mobile : slide.src

const cycleDuration = 5000

const root = ref(null)
const index = ref(0)
const paused = ref(false)

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

let timer = null
let ready = false
let disposed = false

const countText = computed(() => `${index.value + 1} / ${slides.length}`)

function canPlay() {
  return ready && !paused.value && !document.hidden && !reducedMotion.matches && slides.length > 1
}

function sync(delay = cycleDuration) {
  clearTimeout(timer)
  timer = null
  if (!canPlay()) return
  timer = setTimeout(() => {
    timer = null
    if (canPlay()) advance(1)
  }, delay)
}

function advance(direction) {
  if (slides.length < 2) return
  index.value = (index.value + direction + slides.length) % slides.length
  sync()
}

function togglePause() {
  paused.value = !paused.value
  sync()
}

function onVisibilityChange() {
  sync()
}

onMounted(() => {
  const images = [...root.value.querySelectorAll('img')]
  Promise.allSettled(images.map(image => image.decode())).then(() => {
    if (disposed) return
    ready = true
    sync()
  })
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onBeforeUnmount(() => {
  disposed = true
  clearTimeout(timer)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<template>
  <div ref="root" class="home-hero" role="region" aria-roledescription="轮播" aria-label="MLC 服务器图片">
    <div class="hero-backdrop">
      <div class="hero-media">
        <figure
          v-for="(slide, i) in slides"
          :key="slide.src"
          class="hero-slide"
          :class="{ 'is-active': i === index }"
          :aria-hidden="i === index ? 'false' : 'true'"
        >
          <img :src="slideSrc(slide)" :alt="slide.alt" :fetchpriority="i === 0 ? 'high' : undefined">
        </figure>
      </div>
      <div class="hero-overlay"></div>
    </div>
    <div class="page-wrap home-hero-inner">
      <slot />
    </div>
    <div class="hero-controls">
      <button type="button" aria-label="上一张图片" @click="advance(-1)">‹</button>
      <span class="hero-count" aria-live="off">{{ countText }}</span>
      <button type="button" aria-label="下一张图片" @click="advance(1)">›</button>
      <button type="button" class="hero-pause" :aria-pressed="String(paused)" @click="togglePause">{{ paused ? '播放' : '暂停' }}</button>
    </div>
  </div>
</template>
