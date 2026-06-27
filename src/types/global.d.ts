export {}

declare global {
  interface Window {
    openLegal?: (doc: 'privacy' | 'terms') => void
  }
}
