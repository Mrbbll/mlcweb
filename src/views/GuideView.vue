<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import { guideSections, guidePages } from '@/content/guide'

const route = useRoute()

const current = computed(() => guidePages.find(page => page.path === route.path) || guideSections[0])

const html = computed(() => marked
  .parse(current.value.content)
  .replaceAll('src="pics/', `src="${import.meta.env.BASE_URL}pics/`))

function isTrail(section) {
  return section.children?.some(child => child.id === current.value.id) ?? false
}
</script>

<template>
  <section class="view guide-view" aria-label="玩法指南">
    <div class="page-wrap guide-layout">
      <aside class="guide-side">
        <p class="guide-side-title">玩法指南</p>
        <nav class="guide-nav" aria-label="指南目录">
          <template v-for="section in guideSections" :key="section.id">
            <router-link
              :to="section.path"
              :class="{ 'is-active': section.id === current.id, 'is-trail': isTrail(section) }"
            >{{ section.title }}</router-link>
            <router-link
              v-for="child in section.children || []"
              :key="child.id"
              class="guide-nav-sub"
              :to="child.path"
              :class="{ 'is-active': child.id === current.id }"
            >{{ child.title }}</router-link>
          </template>
        </nav>
      </aside>
      <article class="guide-content" v-html="html"></article>
    </div>
  </section>
</template>
