<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import MapView from '@/views/MapView.vue'

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
