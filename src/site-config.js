export const mapUrl = 'http://43.248.188.28:19423/map.html'

export const leaderboardEndpoint = import.meta.env.VITE_LEADERBOARD_ENDPOINT
  || (import.meta.env.DEV ? '/api/v1/leaderboard/playtime?limit=100' : 'data/leaderboard.json')
