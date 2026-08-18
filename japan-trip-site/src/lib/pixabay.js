const CACHE_PREFIX = 'pixabay_'

/**
 * Fetch the first Pixabay photo for a given search query.
 * Caches results in localStorage — '' stored for confirmed misses
 * so we don't re-fetch on every revisit.
 * Returns the webformatURL string, or null on failure / no result.
 */
export async function fetchPixabayImage(query) {
  if (!query) return null

  const cacheKey = CACHE_PREFIX + query
  try {
    const cached = localStorage.getItem(cacheKey)
    if (cached !== null) return cached || null // '' = confirmed miss
  } catch {
    // localStorage unavailable — continue without cache
  }

  const apiKey = import.meta.env.VITE_PIXABAY_API_KEY
  if (!apiKey || apiKey === 'your_key_here') return null

  try {
    const params = new URLSearchParams({
      key: apiKey,
      q: query,
      image_type: 'photo',
      per_page: '3',
      safesearch: 'true',
    })
    const res = await fetch(`https://pixabay.com/api/?${params}`)
    if (!res.ok) return null

    const data = await res.json()
    const url = data.hits?.[0]?.webformatURL ?? ''

    try {
      localStorage.setItem(cacheKey, url)
    } catch {}

    return url || null
  } catch {
    return null
  }
}
