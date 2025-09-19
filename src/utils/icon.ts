// Icon initialization for Feather icons
declare global {
  interface Window {
    feather?: {
      replace(): void;
    };
  }
}

export const initIcons = () => {
  // Initialize feather icons
  setTimeout(() => {
    if (window.feather) {
      window.feather.replace()
    }
  }, 100)
}

// Auto initialize icons when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initIcons()
})

// Re-initialize icons when route changes
export const refreshIcons = () => {
  setTimeout(() => {
    if (window.feather) {
      window.feather.replace()
    }
  }, 50)
}
