<!-- src/components/ui/NotificationAvatar.vue -->
<template>
  <div class="toastify-content flex" :class="{ 'hidden': !show }">
    <div class="w-10 h-10 flex-none image-fit rounded-full overflow-hidden">
      <img 
        :alt="customerName || 'Customer Avatar'" 
        :src="avatarUrl || '/assets/images/profile-2.jpg'"
        class="w-full h-full object-cover"
      >
    </div>
    <div class="ml-4 sm:mr-28">
      <div class="font-medium">{{ customerName || 'Customer' }}</div>
      <div class="text-slate-500 mt-1">{{ message }}</div>
    </div>
    <a 
      v-if="showReplyButton"
      @click="onReply" 
      class="absolute top-0 bottom-0 right-0 flex items-center px-6 border-l border-slate-200/60 dark:border-darkmode-400 font-medium text-primary dark:text-slate-400 cursor-pointer hover:bg-slate-50" 
    >
      Reply
    </a> 
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults, defineEmits } from 'vue'

interface Props {
  customerName?: string
  message?: string
  avatarUrl?: string
  show?: boolean
  showReplyButton?: boolean
}

withDefaults(defineProps<Props>(), {
  customerName: 'Customer',
  message: 'New message received',
  avatarUrl: '/assets/images/profile-2.jpg',
  show: true,
  showReplyButton: true
})

const emit = defineEmits<{
  reply: []
}>()

const onReply = () => {
  emit('reply')
}
</script>

<style scoped>
.toastify-content {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  min-width: 300px;
  max-width: 400px;
  margin-bottom: 8px;
  position: relative;
}

.w-10 {
  width: 2.5rem;
}

.h-10 {
  height: 2.5rem;
}

.flex-none {
  flex: none;
}

.image-fit {
  object-fit: cover;
}

.rounded-full {
  border-radius: 9999px;
}

.overflow-hidden {
  overflow: hidden;
}

.ml-4 {
  margin-left: 1rem;
}

.sm\:mr-28 {
  margin-right: 7rem;
}

.font-medium {
  font-weight: 500;
}

.text-slate-500 {
  color: #64748b;
}

.mt-1 {
  margin-top: 0.25rem;
}

.absolute {
  position: absolute;
}

.top-0 {
  top: 0;
}

.bottom-0 {
  bottom: 0;
}

.right-0 {
  right: 0;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.border-l {
  border-left-width: 1px;
}

.border-slate-200\/60 {
  border-color: rgb(226 232 240 / 0.6);
}

.text-primary {
  color: #3b82f6;
}

.cursor-pointer {
  cursor: pointer;
}

.hover\:bg-slate-50:hover {
  background-color: #f8fafc;
}

@media (max-width: 640px) {
  .sm\:mr-28 {
    margin-right: 1rem;
  }
}
</style>