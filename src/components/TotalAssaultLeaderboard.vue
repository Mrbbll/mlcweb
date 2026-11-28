<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { totalAssaultLeaderboardEndpoint } from '@/site-config'

const data = ref(null)
const status = ref('loading')
const activity = ref('')
const difficulty = ref('normal')
const keyword = ref('')
const page = ref(1)
const pageSize = 20
const difficulties = ['normal', 'hard', 'hardcore', 'ex', 'ins', 'tm', 'lu']
const labels = { HEAD: '头盔', CHEST: '胸甲', LEGS: '护腿', FEET: '靴子', MAIN_HAND: '主手', OFF_HAND: '副手', HOTBAR_2: '辅助 1', HOTBAR_3: '辅助 2', HOTBAR_4: '辅助 3', HOTBAR_5: '辅助 4' }
const order = Object.keys(labels)

onMounted(async () => {
  try {
    const endpoint = totalAssaultLeaderboardEndpoint
    const url = /^(https?:\/\/|\/)/.test(endpoint) ? endpoint : `${import.meta.env.BASE_URL}${endpoint}`
    const response = await fetch(url, { cache: 'no-cache' })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const result = await response.json()
    if (!Array.isArray(result.players) || !Array.isArray(result.activities)) throw new Error('数据格式不正确')
    data.value = result
    activity.value = result.currentActivityId || result.activities[0]?.id || ''
    status.value = 'ready'
  } catch {
    status.value = 'error'
  }
})

const ranked = computed(() => (data.value?.players || [])
  .filter(entry => entry.activityId === activity.value && entry.difficulty === difficulty.value && Number.isFinite(entry.score))
  .sort((a, b) => b.score - a.score || a.battleMillis - b.battleMillis || a.name.localeCompare(b.name))
  .map((entry, index) => ({ ...entry, rank: index + 1 })))
const filtered = computed(() => {
  const query = keyword.value.trim().toLowerCase()
  return query ? ranked.value.filter(entry => entry.name.toLowerCase().includes(query)) : ranked.value
})
const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))
const displayed = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize))
watch([activity, difficulty, keyword], () => { page.value = 1 })

function formatDuration(millis) {
  const ms = Math.max(0, Number(millis) || 0)
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}.${String(Math.floor(ms % 1000)).padStart(3, '0')}`
}
function orderedItems(items) {
  return [...(items || [])].sort((a, b) => order.indexOf(a.slot) - order.indexOf(b.slot))
}
</script>

<template>
  <div class="assault">
    <p v-if="status === 'loading'" class="leaderboard-state" role="status">正在加载总力战成绩……</p>
    <p v-else-if="status === 'error'" class="leaderboard-state" role="status">总力战成绩暂时读取不到，稍后再试。</p>
    <template v-else>
      <div class="assault-filters">
        <label>活动
          <select v-model="activity">
            <option v-for="event in data.activities" :key="event.id" :value="event.id">{{ event.name }}</option>
          </select>
        </label>
        <label>难度
          <select v-model="difficulty">
            <option v-for="level in difficulties" :key="level" :value="level">{{ level.toUpperCase() }}</option>
          </select>
        </label>
        <label>玩家
          <input v-model="keyword" type="search" placeholder="搜索玩家名">
        </label>
      </div>
      <p class="assault-hint">每位玩家显示本期最高成绩；名次在所选难度内按得分计算。</p>
      <p v-if="!displayed.length" class="leaderboard-state">该活动和难度下暂无匹配成绩。</p>
      <ol v-else class="assault-list">
        <li v-for="entry in displayed" :key="entry.activityId + entry.uuid">
          <details>
            <summary class="assault-summary">
              <span class="assault-rank">{{ entry.rank }}</span>
              <span class="assault-player">{{ entry.name }}<small>{{ entry.difficulty.toUpperCase() }} · {{ formatDuration(entry.battleMillis) }}</small></span>
              <span class="assault-score">{{ entry.score.toLocaleString('zh-CN') }} <small>分</small></span>
              <span aria-hidden="true">⌄</span>
            </summary>
            <div class="assault-detail">
              <p v-if="!entry.attempts?.length">没有可展示的出战记录。</p>
              <section v-for="attempt in entry.attempts" :key="attempt.number" class="assault-attempt">
                <h3>第 {{ attempt.number }} 次出战 <small>{{ formatDuration(attempt.battleMillis) }}</small></h3>
                <div v-if="attempt.items?.length" class="assault-items">
                  <div v-for="item in orderedItems(attempt.items)" :key="item.slot" class="assault-item">
                    <span class="assault-slot">{{ labels[item.slot] || item.slot }}</span>
                    <strong>{{ item.name }}</strong><span v-if="item.amount > 0"> × {{ item.amount }}</span>
                    <small v-if="item.itemModel">模型：{{ item.itemModel }}</small>
                    <small v-else-if="item.material && item.name !== item.material">{{ item.material }}</small>
                    <small v-if="item.damage != null">已损耗耐久：{{ item.damage }}</small>
                    <small v-for="(level, name) in item.enchantments" :key="name">{{ name }} {{ level }}</small>
                    <small v-for="(text, index) in item.lore" :key="index">{{ text }}</small>
                  </div>
                </div>
                <p v-else>本次未携带物品。</p>
              </section>
            </div>
          </details>
        </li>
      </ol>
      <nav v-if="pages > 1" class="leaderboard-pager" aria-label="总力战排行榜分页">
        <button type="button" :disabled="page === 1" @click="page--">上一页</button><span>{{ page }} / {{ pages }}</span><button type="button" :disabled="page === pages" @click="page++">下一页</button>
      </nav>
    </template>
  </div>
</template>

<style scoped>
.assault-filters { display: flex; gap: 12px; flex-wrap: wrap; margin: 12px 0 8px; }
.assault-filters label { display: flex; flex: 1 1 150px; flex-direction: column; gap: 6px; color: rgba(255,255,255,.72); font-size: 13px; }
.assault-filters select, .assault-filters input { width: 100%; height: 40px; padding: 0 12px; color: #fff; border: 1px solid rgba(255,255,255,.3); border-radius: 8px; background: rgba(18,24,18,.8); font: inherit; }
.assault-filters select:focus, .assault-filters input:focus { outline: 2px solid #fad64a; outline-offset: 2px; }
.assault-hint { color: rgba(255,255,255,.64); font-size: 13px; line-height: 1.6; }
.assault-list { list-style: none; padding: 0; margin: 16px 0 0; }
.assault-list > li { border-top: 1px solid rgba(255,255,255,.16); }
.assault-summary { display: flex; align-items: center; gap: 14px; padding: 14px 4px; color: white; cursor: pointer; list-style: none; }
.assault-summary::-webkit-details-marker { display: none; }
.assault-rank { display: grid; place-items: center; min-width: 32px; height: 32px; color: #fad64a; background: rgba(250,214,74,.12); border-radius: 8px; font-weight: 700; }
.assault-player { flex: 1; min-width: 0; overflow-wrap: anywhere; }
.assault-player small, .assault-item small { display: block; color: rgba(255,255,255,.64); font-size: 12px; margin-top: 4px; overflow-wrap: anywhere; }
.assault-score { white-space: nowrap; color: #fad64a; font-variant-numeric: tabular-nums; }
.assault-score small, .assault-attempt h3 small { font-size: 12px; font-weight: normal; color: rgba(255,255,255,.65); }
.assault-detail { padding: 0 0 16px 46px; color: rgba(255,255,255,.8); }
.assault-attempt { border-top: 1px solid rgba(255,255,255,.12); padding: 8px 0; }
.assault-attempt h3 { font-size: 14px; font-weight: 600; color: #fad64a; }
.assault-items { display: grid; grid-template-columns: repeat(auto-fit, minmax(155px, 1fr)); gap: 8px; }
.assault-item { padding: 10px; border: 1px solid rgba(255,255,255,.16); border-radius: 8px; font-size: 13px; overflow-wrap: anywhere; }
.assault-slot { display: block; margin-bottom: 5px; color: #fad64a; font-size: 12px; }
@media (max-width: 520px) { .assault-detail { padding-left: 0; } .assault-items { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
</style>
