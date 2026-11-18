<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import { guideSections } from '@/content/guide'

const route = useRoute()

const current = computed(() => guideSections.find(section => section.id === route.params.section) || guideSections[0])

const html = computed(() => marked
  .parse(current.value.content)
  .replaceAll('src="pics/', `src="${import.meta.env.BASE_URL}pics/`))
</script>

<template>
  <section class="view guide-view" aria-label="玩法指南">
    <div class="page-wrap guide-layout">
      <aside class="guide-side">
        <p class="guide-side-title">玩法指南</p>
        <nav class="guide-nav" aria-label="指南目录">
          <router-link
            v-for="section in guideSections"
            :key="section.id"
            :to="section.path"
            :class="{ 'is-active': section.id === current.id }"
          >{{ section.title }}</router-link>
        </nav>
      </aside>
      <article class="guide-content" v-html="html"></article>
    </div>
  </section>
</template>
