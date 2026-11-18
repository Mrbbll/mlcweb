<script setup>
import { guideUrl } from '@/site-config'
</script>

<template>
  <section class="view text-view" aria-labelledby="about-title">
    <div class="page-wrap">
      <div class="about-content">
        <h1 id="about-title">关于 MLC</h1>
        <p class="about-copy">服务器介绍还在整理。<br>游戏地址、版本和联系方式会在确认后补充到这里。</p>
        <div class="about-links">
          <a :href="guideUrl">阅读玩法指南</a>
          <router-link to="/map">打开在线地图</router-link>
        </div>
      </div>
    </div>
  </section>
</template>
