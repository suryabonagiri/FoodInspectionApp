const locationWords = /\b(near|opposite|beside|behind|at|the|road|street|junction)\b/g
export const tidy = (value = '') => value.toLowerCase().replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, ' ').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
export const normalizeRestaurantName = (name = '') => tidy(name).replace(locationWords, ' ').replace(/\s+/g, ' ').trim()
export const normalizeLocation = (location = '') => tidy(location).replace(locationWords, ' ').replace(/\s+/g, ' ').trim()
export const slugify = (value = '') => normalizeRestaurantName(value).replace(/\s+/g, '-')
