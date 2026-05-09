/**
 * Reading settings — font, fontSize, darkMode.
 * Persisted in localStorage. CSS custom properties applied to <html>.
 * This module is bundled by Vite and shared across all pages.
 */

const STORAGE_KEY = 'truyen_reading_settings'

export const FONT_OPTIONS = [
  { id: 'garamond',     label: 'EB Garamond',  family: "'EB Garamond', serif" },
  { id: 'merriweather', label: 'Merriweather', family: "'Merriweather', serif" },
  { id: 'lora',         label: 'Lora',         family: "'Lora', serif" },
  { id: 'literata',     label: 'Literata',     family: "'Literata', serif" },
  { id: 'georgia',      label: 'Georgia',      family: "Georgia, serif" },
  { id: 'inter',        label: 'Inter',        family: "'Inter', sans-serif" },
  { id: 'mono',         label: 'Mono',         family: "'JetBrains Mono', monospace" },
]

const DEFAULT = { fontId: 'garamond', fontSize: 20, darkMode: false }

/** @type {{ fontId: string, fontSize: number, darkMode: boolean }} */
let settings = DEFAULT

function load() {
  try {
    return { ...DEFAULT, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }
  } catch {
    return DEFAULT
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

function applyToDOM() {
  const root = document.documentElement
  root.classList.toggle('dark', settings.darkMode)
  const font = FONT_OPTIONS.find((f) => f.id === settings.fontId) ?? FONT_OPTIONS[0]
  root.style.setProperty('--reading-font', font.family)
  root.style.setProperty('--reading-size', settings.fontSize + 'px')
}

// Initialize on module load — applies font/size vars and syncs dark class
settings = load()
applyToDOM()

export function getSettings() {
  return { ...settings }
}

export function toggleDarkMode() {
  settings = { ...settings, darkMode: !settings.darkMode }
  persist()
  applyToDOM()
  // Update all dark mode button icons
  document.dispatchEvent(new CustomEvent('settings:darkmodechanged', { detail: settings }))
}

export function setFontId(fontId) {
  settings = { ...settings, fontId }
  persist()
  applyToDOM()
}

export function setFontSize(fontSize) {
  settings = { ...settings, fontSize }
  persist()
  applyToDOM()
}
