/**
 * Reading progress — persists current chapter per story slug in localStorage.
 * Vanilla JS module, shared across pages.
 */

const STORAGE_KEY = 'truyen_progress'

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function writeAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

/** @returns {{ chapter: number, updatedAt: string } | null} */
export function getProgress(slug) {
  const all = readAll()
  return all[slug] ?? null
}

export function saveProgress(slug, chapter) {
  const all = readAll()
  all[slug] = { chapter, updatedAt: new Date().toISOString() }
  writeAll(all)
}

export function getAllProgress() {
  return readAll()
}
