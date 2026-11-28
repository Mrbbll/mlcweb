<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { economyLeaderboardEndpoint, leaderboardEndpoint } from '@/site-config'
import { renderPlayerHead } from '@/utils/head-renderer'
import TotalAssaultLeaderboard from '@/components/TotalAssaultLeaderboard.vue'

const baseUrl = import.meta.env.BASE_URL
const backdropUrl = `${baseUrl}pics/server-01.jpg`
const CACHE_VERSION = 3
const CACHE_TTL = 60 * 60 * 1000
const balanceFormatter = new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 2 })

const boards = reactive({
  playtime: {
    label: '在线时长',
    title: '在线时长',
    totalLabel: '累计时长',
    endpoint: leaderboardEndpoint,
    cacheKey: 'mlc-leaderboard',
    valueKey: 'seconds',
    formatValue: formatHours,
    formatTotal: formatTotalHours,
    status: 'idle',
    payload: null,
  },
  economy: {
    label: '经济排行',
    title: '经济排行',
    totalLabel: '榜内余额合计',
    endpoint: economyLeaderboardEndpoint,
    cacheKey: 'mlc-economy-leaderboard',
    valueKey: 'balance',
    formatValue: formatBalance,
    formatTotal: formatBalance,
    status: 'idle',
    payload: null,
  },
})
boards.assault = { label: '总力战', title: '总力战', status: 'idle', payload: null }
const activeKey = ref('playtime')
const board = computed(() => boards[activeKey.value])
const payload = computed(() => board.value.payload)
const keyword = ref('')

function readCache(cacheKey) {
  try {
    const raw = localStorage.getItem(cacheKey)
    if (!raw) return null
    const entry = JSON.parse(raw)
    if (entry.version !== CACHE_VERSION) return null
    if (!Number.isFinite(entry.savedAt) || Date.now() - entry.savedAt > CACHE_TTL) return null
    return entry.data
  } catch {
    return null
  }
}

function writeCache(cacheKey, data) {
  try {
    localStorage.setItem(cacheKey, JSON.stringify({
      version: CACHE_VERSION,
      savedAt: Date.now(),
      data,
    }))
  } catch {
  }
}

async function loadLeaderboard(selected) {
  if (selected.status === 'loading' || selected.status === 'ready') return
  const cached = readCache(selected.cacheKey)
  if (cached) {
    selected.payload = cached
    selected.status = 'ready'
    return
  }

  selected.status = 'loading'
  const { endpoint } = selected
  const url = /^(https?:\/\/|\/)/.test(endpoint) ? endpoint : `${baseUrl}${endpoint}`
  try {
    const response = await fetch(url, { cache: 'no-cache' })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    if (!Array.isArray(data?.players)) throw new Error('Invalid leaderboard payload')
    selected.payload = data
    selected.status = 'ready'
    writeCache(selected.cacheKey, data)
  } catch {
    selected.status = 'error'
  }
}

onMounted(() => loadLeaderboard(board.value))

const ranked = computed(() => {
  const { valueKey } = board.value
  if (activeKey.value === 'assault') return []
  return (payload.value?.players ?? [])
    .filter(player => typeof player?.name === 'string' && player.name && Number.isFinite(player[valueKey])
      && (player.name === '7_door_3' || !/_\d+$|^[A-Z]{2}\d+$|^\d+$|^(.)\1+$|^MLC$/.test(player.name)))
    .sort((a, b) => b[valueKey] - a[valueKey])
    .map((player, index) => ({ ...player, rank: index + 1 }))
})

const PAGE_SIZE = 20
const page = ref(1)

const filtered = computed(() => {
  const query = keyword.value.trim().toLowerCase()
  if (!query) return ranked.value
  return ranked.value.filter(player => player.name.toLowerCase().includes(query))
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))

const paged = computed(() => filtered.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE))

watch(keyword, () => {
  page.value = 1
})

watch(activeKey, () => {
  keyword.value = ''
  page.value = 1
  if (activeKey.value !== 'assault') loadLeaderboard(board.value)
})

const totalLabel = computed(() => {
  const { valueKey, formatTotal } = board.value
  if (activeKey.value === 'assault') return ''
  return formatTotal(ranked.value.reduce((sum, player) => sum + player[valueKey], 0))
})

const totalPlayers = computed(() => ranked.value.length)

const isDemo = computed(() => payload.value?.demo === true)

const updatedAt = computed(() => {
  const value = payload.value?.updatedAt
  if (!value) return '未标注'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '未标注' : date.toLocaleDateString('zh-CN')
})

function formatTotalHours(seconds) {
  const hours = Math.round(seconds / 3600)
  return hours >= 1000 ? `${(hours / 1000).toFixed(1)}K H` : `${hours.toLocaleString('zh-CN')} H`
}

function formatHours(seconds) {
  return `${Math.round(seconds / 3600).toLocaleString('zh-CN')} H`
}

function formatBalance(balance) {
  return `${balanceFormatter.format(balance)} 水晶币`
}

const headImages = ref({})
let headRunId = 0

async function loadHeadImages(players) {
  const runId = ++headRunId
  for (const player of players) {
    if (runId !== headRunId) return
    if (headImages.value[player.name]) continue
    const skinUrl = `https://crafthead.net/skin/${encodeURIComponent(player.uuid || player.name)}`
    const image = await renderPlayerHead(skinUrl)
    if (image && runId === headRunId) {
      headImages.value[player.name] = image
    }
  }
}

watch(paged, players => {
  loadHeadImages(players)
}, { immediate: true })

function avatarUrl(name) {
  return `https://crafthead.net/helm/${encodeURIComponent(name)}/64`
}

function onAvatarError(event) {
  event.target.remove()
}

function podiumClass(rank) {
  return { 'is-first': rank === 1, 'is-second': rank === 2, 'is-third': rank === 3 }
}
</script>

<template>
  <section class="view leaderboard-view" aria-labelledby="leaderboard-title">
    <div class="leaderboard-backdrop" aria-hidden="true">
      <img :src="backdropUrl" alt="">
    </div>
    <div class="page-wrap leaderboard-wrap">
      <header class="leaderboard-head">
        <h1 id="leaderboard-title">{{ board.title }}</h1>
      </header>

      <div class="leaderboard-panel">
        <div class="leaderboard-switch" role="group" aria-label="选择排行榜">
          <button
            v-for="(option, key) in boards"
            :key="key"
            type="button"
            :aria-pressed="activeKey === key"
            @click="activeKey = key"
          >{{ option.label }}</button>
        </div>
        <TotalAssaultLeaderboard v-if="activeKey === 'assault'" />
        <template v-else>
        <p v-if="isDemo" class="leaderboard-notice">数据接口还在接入，以下是示例数据，正式数据上线后自动替换。</p>

        <p v-if="board.status === 'idle' || board.status === 'loading'" class="leaderboard-state" role="status">正在加载排行榜……</p>
        <p v-else-if="board.status === 'error'" class="leaderboard-state" role="status">排行榜数据暂时读取不到，稍后再试。</p>

        <template v-else>
          <div class="leaderboard-summary">
            <div class="leaderboard-stat">
              <span class="leaderboard-stat-value">{{ totalPlayers }}</span>
              <span class="leaderboard-stat-label">上榜玩家</span>
            </div>
            <div class="leaderboard-stat">
              <span class="leaderboard-stat-value">{{ totalLabel }}</span>
              <span class="leaderboard-stat-label">{{ board.totalLabel }}</span>
            </div>
            <div class="leaderboard-stat">
              <span class="leaderboard-stat-value">{{ updatedAt }}</span>
              <span class="leaderboard-stat-label">更新日期</span>
            </div>
          </div>

          <div class="leaderboard-search">
            <input v-model="keyword" type="search" placeholder="搜索玩家名" aria-label="搜索玩家名">
          </div>

          <ol v-if="filtered.length" class="leaderboard-list">
            <li
              v-for="player in paged"
              :key="player.uuid || player.name"
              class="leaderboard-item"
              :class="podiumClass(player.rank)"
            >
              <span class="leaderboard-rank">{{ player.rank }}</span>
              <span class="leaderboard-avatar">
                <img :src="headImages[player.name] || avatarUrl(player.name)" :alt="player.name" width="40" height="40" loading="lazy" @error="onAvatarError">
              </span>
              <span class="leaderboard-name">{{ player.name }}</span>
              <span class="leaderboard-time">{{ board.formatValue(player[board.valueKey]) }}</span>
            </li>
          </ol>
          <nav v-if="filtered.length && totalPages > 1" class="leaderboard-pager" aria-label="排行榜分页">
            <button type="button" :disabled="page === 1" @click="page--">上一页</button>
            <span>{{ page }} / {{ totalPages }}</span>
            <button type="button" :disabled="page === totalPages" @click="page++">下一页</button>
          </nav>
          <p v-if="!filtered.length" class="leaderboard-state">{{ keyword.trim() ? '没有匹配的玩家。' : '暂无上榜玩家。' }}</p>
        </template>
        </template>
      </div>
    </div>
  </section>
</template>
