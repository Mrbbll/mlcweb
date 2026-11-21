<script setup>
import { marked } from 'marked'
import aboutContent from '@/content/about.md?raw'

const html = marked
  .parse(aboutContent, { breaks: true })
  .replaceAll('<table>', '<div class="table-scroll"><table>')
  .replaceAll('</table>', '</table></div>')
  .replaceAll('src="pics/', `src="${import.meta.env.BASE_URL}pics/`)
</script>

<template>
  <section class="view about-view" aria-label="关于 MLC">
    <div class="page-wrap guide-layout">
      <div class="about-main">
        <article class="guide-content" v-html="html"></article>
        <div class="about-links">
          <router-link to="/guide">阅读玩法指南</router-link>
          <router-link to="/map">打开在线地图</router-link>
        </div>
      </div>
    </div>
  </section>
</template>
