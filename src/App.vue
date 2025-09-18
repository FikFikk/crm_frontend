<script setup lang="ts">
// App.vue - Main application component
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NotificationContainer from './components/ui/NotificationContainer.vue'
import { useSocket } from './composables/useSocket'
import { useNotification } from './composables/useNotification'
// import '../src/assets/dist/css/app.css' 

const router = useRouter()
const { onSocket } = useSocket()
const { showAvatarNotification } = useNotification()

onMounted(() => {
  onSocket('message_received', (response: any) => {
    // Hanya tampilkan notifikasi jika bukan di halaman chat
    const isOnChatPage = router.currentRoute.value.path.includes('/chat')
    
    if (!isOnChatPage && response && response.chat && response.customer) {
      let messageContent = response.chat.body || 'Pesan baru';
      
      // Format pesan berdasarkan tipe
      if (response.chat.type === 'image') {
        messageContent = '📷 ' + messageContent;
      } else if (response.chat.type === 'video') {
        messageContent = '🎥 ' + messageContent;
      } else if (response.chat.type === 'audio') {
        messageContent = '🎵 Audio Message';
      } else if (response.chat.type === 'document') {
        messageContent = '📄 ' + messageContent;
      } else if (response.chat.type === 'location') {
        messageContent = '📍 Location Shared';
      }
      
      showAvatarNotification(
        response.customer.name || 'Customer',
        messageContent,
        {
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(response.customer.name || 'C')}&background=3b82f6&color=ffffff`,
          conversationId: response.chat.conversationId,
          duration: 8000 // Auto-dismiss after 8 seconds
        }
      );
    }
  });
})
</script>

<template>
  <router-view />
  
  <!-- Global notification container -->
  <NotificationContainer />
</template>

<!-- <style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.5;
  color: #1e293b;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Responsive grid */
.grid {
  display: grid;
}

.grid-cols-12 {
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

.col-span-3 {
  grid-column: span 3 / span 3;
}

.col-span-6 {
  grid-column: span 6 / span 6;
}

.col-span-12 {
  grid-column: span 12 / span 12;
}

.gap-4 {
  gap: 1rem;
}

.gap-6 {
  gap: 1.5rem;
}

/* Flexbox utilities */
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.flex-col {
  flex-direction: column;
}

/* Spacing utilities */
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 0.75rem; }
.mt-4 { margin-top: 1rem; }
.mt-5 { margin-top: 1.25rem; }
.mt-8 { margin-top: 2rem; }
.mt-10 { margin-top: 2.5rem; }
.mt-24 { margin-top: 6rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-10 { margin-bottom: 2.5rem; }
.mr-2 { margin-right: 0.5rem; }
.mr-3 { margin-right: 0.75rem; }
.mr-4 { margin-right: 1rem; }
.mr-10 { margin-right: 2.5rem; }
.mr-auto { margin-right: auto; }
.ml-1 { margin-left: 0.25rem; }
.ml-3 { margin-left: 0.75rem; }

.py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
.py-5 { padding-top: 1.25rem; padding-bottom: 1.25rem; }
.py-8 { padding-top: 2rem; padding-bottom: 2rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.px-5 { padding-left: 1.25rem; padding-right: 1.25rem; }
.px-8 { padding-left: 2rem; padding-right: 2rem; }
.px-10 { padding-left: 2.5rem; padding-right: 2.5rem; }
.pt-5 { padding-top: 1.25rem; }
.p-0 { padding: 0; }
.p-5 { padding: 1.25rem; }

/* Width/Height utilities */
.w-6 { width: 1.5rem; }
.w-32 { width: 8rem; }
.w-40 { width: 10rem; }
.w-full { width: 100%; }
.h-1 { height: 0.25rem; }
.h-12 { height: 3rem; }
.h-full { height: 100%; }
.h-screen { height: 100vh; }
.min-h-screen { min-height: 100vh; }

/* Text utilities */
.text-xs { font-size: 0.75rem; }
.text-sm { font-size: 0.875rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }
.text-3xl { font-size: 1.875rem; }
.text-4xl { font-size: 2.25rem; }

.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }

.text-center { text-align: center; }
.text-left { text-align: left; }

.leading-tight { line-height: 1.25; }

/* Colors */
.text-white { color: white; }
.text-slate-400 { color: #94a3b8; }
.text-slate-500 { color: #64748b; }
.text-slate-600 { color: #475569; }
.text-gray-700 { color: #374151; }
.text-gray-300 { color: #d1d5db; }
.text-red-500 { color: #ef4444; }

.bg-white { background-color: white; }
.bg-red-500 { background-color: #ef4444; }
.bg-yellow-500 { background-color: #eab308; }
.bg-blue-500 { background-color: #3b82f6; }
.bg-green-500 { background-color: #22c55e; }
.bg-slate-100 { background-color: #f1f5f9; }

/* Display utilities */
.block { display: block; }
.hidden { display: none; }

/* Position utilities */
.fixed { position: fixed; }
.bottom-0 { bottom: 0; }
.right-0 { right: 0; }

/* Border utilities */
.border { border-width: 1px; }
.rounded { border-radius: 0.25rem; }
.rounded-md { border-radius: 0.375rem; }
.rounded-full { border-radius: 9999px; }

/* Shadow utilities */
.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Z-index */
.z-50 { z-index: 50; }

/* Cursor */
.cursor-pointer { cursor: pointer; }
.cursor-not-allowed { cursor: not-allowed; }

/* Select */
.select-none {
  user-select: none;
}

/* Responsive utilities */
@media (min-width: 640px) {
  .sm\:px-10 { padding-left: 2.5rem; padding-right: 2.5rem; }
  .sm\:w-3\/4 { width: 75%; }
  .sm\:text-sm { font-size: 0.875rem; }
}

@media (min-width: 1024px) {
  .lg\:w-2\/4 { width: 50%; }
  .lg\:col-span-6 { grid-column: span 6 / span 6; }
}

@media (min-width: 1280px) {
  .xl\:grid { display: grid; }
  .xl\:h-auto { height: auto; }
  .xl\:py-0 { padding-top: 0; padding-bottom: 0; }
  .xl\:my-0 { margin-top: 0; margin-bottom: 0; }
  .xl\:ml-20 { margin-left: 5rem; }
  .xl\:mr-3 { margin-right: 0.75rem; }
  .xl\:mt-0 { margin-top: 0; }
  .xl\:mt-8 { margin-top: 2rem; }
  .xl\:mt-24 { margin-top: 6rem; }
  .xl\:bg-transparent { background-color: transparent; }
  .xl\:p-0 { padding: 0; }
  .xl\:shadow-none { box-shadow: none; }
  .xl\:w-auto { width: auto; }
  .xl\:w-32 { width: 8rem; }
  .xl\:text-3xl { font-size: 1.875rem; }
  .xl\:text-left { text-align: left; }
  .xl\:flex { display: flex; }
  .xl\:hidden { display: none; }
}
</style> -->
