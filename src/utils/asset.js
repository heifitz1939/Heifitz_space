const base = import.meta.env.BASE_URL.replace(/\/$/, '')
export const asset = (path) => `${base}${path}`
