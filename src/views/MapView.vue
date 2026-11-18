<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { mapUrl } from '@/site-config'

const route = useRoute()

function queryValue(value) {
  const text = Array.isArray(value) ? value[0] : value
  return text ? String(text) : ''
}

function numberValue(value) {
  const text = queryValue(value)
  if (!text) return null
  const parsed = Number(text)
  return Number.isFinite(parsed) ? parsed : null
}

function buildFrameSrc() {
  const world = queryValue(route.query.world)
  if (!world) return mapUrl
  const x = numberValue(route.query.x)
  const z = numberValue(route.query.z)
  if (x === null || z === null) return `${mapUrl}#${world}`
  const location = [
    world,
    x,
    numberValue(route.query.y) ?? 64,
    z,
    numberValue(route.query.distance) ?? 250,
    numberValue(route.query.rotation) ?? 0,
    numberValue(route.query.angle) ?? 0,
    numberValue(route.query.tilt) ?? 0,
    numberValue(route.query.ortho) ?? 0,
    queryValue(route.query.mode) || 'perspective',
  ]
  return `${mapUrl}#${location.join(':')}`
}

const frameSrc = ref(buildFrameSrc())

watch(() => route.fullPath, () => {
  if (route.name !== 'map') return
  if (!queryValue(route.query.world)) return
  frameSrc.value = buildFrameSrc()
})
</script>

<template>
  <section class="view map-view" aria-label="在线地图">
    <iframe :src="frameSrc" title="BlueMap 在线地图" allow="fullscreen" referrerpolicy="same-origin"></iframe>
  </section>
</template>
