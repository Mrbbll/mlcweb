<script setup>
import ServerCarousel from '@/components/ServerCarousel.vue'
</script>

<template>
  <section class="view home-view" aria-labelledby="home-title">
    <ServerCarousel>
      <h1 id="home-title">MLC</h1>
      <p class="intro-copy">新来的朋友，先看看玩法指南。<br>想找地方，就打开在线地图。</p>
      <div class="hero-actions">
        <router-link class="button button-primary" to="/guide">玩法指南</router-link>
        <router-link class="button button-secondary" to="/map">在线地图</router-link>
      </div>
    </ServerCarousel>
    <div class="home-panel">
      <div class="page-wrap">
        <div class="home-details">
          <router-link to="/guide"><h2>玩法指南</h2><p>进服前，先了解规则与玩法。</p></router-link>
          <router-link to="/map"><h2>在线地图</h2><p>查地形，找建筑，看看服务器的世界。</p></router-link>
        </div>
      </div>
    </div>
  </section>
</template>
