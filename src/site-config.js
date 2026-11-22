export const mapUrl = 'https://mlcmap.odn.cc/'

export const leaderboardEndpoint = import.meta.env.VITE_LEADERBOARD_ENDPOINT
  || (import.meta.env.DEV ? '/api/v1/leaderboard/playtime?limit=100' : 'data/leaderboard.json')
