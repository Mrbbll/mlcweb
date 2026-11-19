<script setup>
import { computed, onMounted, ref } from 'vue'
import { leaderboardEndpoint } from '@/site-config'

const baseUrl = import.meta.env.BASE_URL
const backdropUrl = `${baseUrl}pics/server-01.jpg`
const leaderboardUrl = /^https?:\/\//.test(leaderboardEndpoint)
  ? leaderboardEndpoint
  : `${baseUrl.replace(/\/$/, '')}/${leaderboardEndpoint.replace(/^\//, '')}`

const CACHE_KEY = 'mlc-leaderboard'
const CACHE_VERSION = 1

const status = ref('loading')
const payload = ref(null)
const keyword = ref('')

function todayStamp() {
  const now = new Date()
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const entry = JSON.parse(raw)
    if (entry.version !== CACHE_VERSION || entry.date !== todayStamp()) return null
    return entry.data
  } catch (error) {
    return null
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      version: CACHE_VERSION,
      date: todayStamp(),
      data,
    }))
  } catch {
  }
}

async function loadLeaderboard() {
  const cached = readCache()
  if (cached) {
    payload.value = cached
    status.value = 'ready'
    return
  }

  try {
    const response = await fetch(leaderboardUrl, { cache: 'no-cache' })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    payload.value = data
    status.value = 'ready'
    writeCache(data)
  } catch (error) {
    status.value = 'error'
  }
}

onMounted(loadLeaderboard)

const ranked = computed(() => (payload.value?.players ?? [])
  .filter(player => player && player.name)
  .slice()
  .sort((a, b) => (b.seconds || 0) - (a.seconds || 0))
  .map((player, index) => ({ ...player, rank: index + 1 })))

const shown = computed(() => {
  const query = keyword.value.trim().toLowerCase()
  if (!query) return ranked.value
  return ranked.value.filter(player => player.name.toLowerCase().includes(query))
})

const totalSeconds = computed(() => ranked.value.reduce((sum, player) => sum + (player.seconds || 0), 0))

const totalPlayers = computed(() => payload.value?.totalPlayers ?? ranked.value.length)

const isDemo = computed(() => payload.value?.demo === true)

const updatedAt = computed(() => {
  const value = payload.value?.updatedAt
  if (!value) return '未标注'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '未标注' : date.toLocaleDateString('zh-CN')
})

const totalLabel = computed(() => {
  const hours = Math.round(totalSeconds.value / 3600)
  return hours >= 1000 ? `${(hours / 1000).toFixed(1)}K 小时` : `${hours.toLocaleString('zh-CN')} 小时`
})

function formatHours(seconds) {
  return `${Math.round((seconds || 0) / 3600).toLocaleString('zh-CN')} 小时`
}

function avatarUrl(name) {
  return `https://crafthead.net/avatar/${encodeURIComponent(name)}/64`
}

function onAvatarError(event) {
  event.target.remove()
}

function podiumClass(rank) {
  return { 'is-first': rank === 1, 'is-second': rank === 2, 'is-third': rank === 3 }
}
</script>

<template>
  <section class="view leaderboard-view" aria-label="玩家在线时长排行榜">
    <div class="leaderboard-backdrop" aria-hidden="true">
      <img :src="backdropUrl" alt="">
    </div>
    <div class="page-wrap leaderboard-wrap">
      <header class="leaderboard-head">
        <p class="leaderboard-kicker">排行榜</p>
        <h1>玩家在线时长</h1>
        <p class="leaderboard-desc">按服务器记录的累计在线时长排序，数据定期更新。</p>
      </header>

      <div class="leaderboard-panel">
        <p v-if="isDemo" class="leaderboard-notice">数据接口还在接入，以下是示例数据，正式数据上线后自动替换。</p>

        <p v-if="status === 'loading'" class="leaderboard-state">正在加载排行榜……</p>
        <p v-else-if="status === 'error'" class="leaderboard-state">排行榜数据暂时读取不到，稍后再试。</p>

        <template v-else>
          <div class="leaderboard-summary">
            <div class="leaderboard-stat">
              <span class="leaderboard-stat-value">{{ totalPlayers }}</span>
              <span class="leaderboard-stat-label">上榜玩家</span>
            </div>
            <div class="leaderboard-stat">
              <span class="leaderboard-stat-value">{{ totalLabel }}</span>
              <span class="leaderboard-stat-label">累计时长</span>
            </div>
            <div class="leaderboard-stat">
              <span class="leaderboard-stat-value">{{ updatedAt }}</span>
              <span class="leaderboard-stat-label">更新日期</span>
            </div>
          </div>

          <div class="leaderboard-search">
            <input v-model="keyword" type="search" placeholder="搜索玩家名" aria-label="搜索玩家名">
          </div>

          <ol v-if="shown.length" class="leaderboard-list">
            <li
              v-for="player in shown"
              :key="player.name"
              class="leaderboard-item"
              :class="podiumClass(player.rank)"
            >
              <span class="leaderboard-rank">{{ player.rank }}</span>
              <span class="leaderboard-avatar">
                <span class="leaderboard-initial">{{ player.name.slice(0, 1).toUpperCase() }}</span>
                <img :src="avatarUrl(player.name)" :alt="player.name" width="40" height="40" loading="lazy" @error="onAvatarError">
              </span>
              <span class="leaderboard-name">{{ player.name }}</span>
              <span class="leaderboard-time">{{ formatHours(player.seconds) }}</span>
            </li>
          </ol>
          <p v-else class="leaderboard-state">没有匹配的玩家。</p>
        </template>
      </div>
    </div>
  </section>
</template>
