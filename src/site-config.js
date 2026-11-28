export const mapUrl = 'https://mlcmap.odn.cc/'

export const leaderboardEndpoint = import.meta.env.VITE_LEADERBOARD_ENDPOINT
  || (import.meta.env.DEV ? '/api/v1/leaderboard/playtime?limit=100' : 'data/leaderboard.json')

export const economyLeaderboardEndpoint = import.meta.env.VITE_ECONOMY_LEADERBOARD_ENDPOINT
  || (import.meta.env.DEV ? '/api/v1/leaderboard/economy?limit=100' : 'data/economy-leaderboard.json')

export const totalAssaultLeaderboardEndpoint = import.meta.env.VITE_TOTAL_ASSAULT_ENDPOINT
  || (import.meta.env.DEV ? "/api/v1/totalassault/leaderboard" : "data/totalassault-leaderboard.json")
