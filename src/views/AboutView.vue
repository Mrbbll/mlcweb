<script setup>
const backdropUrl = `${import.meta.env.BASE_URL}pics/server-02.png`
</script>

<template>
  <section class="view about-view" aria-labelledby="about-title">
    <div class="about-backdrop" aria-hidden="true">
      <img :src="backdropUrl" alt="">
    </div>
    <div class="page-wrap about-wrap">
      <div class="about-panel">
        <h1 id="about-title">关于 MLC</h1>
        <p class="about-copy">服务器介绍还在整理。<br>游戏地址、版本和联系方式会在确认后补充到这里。</p>
        <div class="about-links">
          <router-link to="/guide">阅读玩法指南</router-link>
          <router-link to="/map">打开在线地图</router-link>
        </div>
      </div>
    </div>
  </section>
</template>
