<template>
  <div class="message-status-icon inline-flex items-center justify-center ml-1" :title="statusText">
    <!-- Sending (clock icon) -->
    <svg v-if="status === 'sending'" 
      class="w-4 h-4 text-gray-400" 
      fill="currentColor" 
      viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
    </svg>

    <!-- Failed (X icon) -->
    <svg v-else-if="status === 'failed'" 
      class="w-4 h-4 text-red-500" 
      fill="currentColor" 
      viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
    </svg>

    <!-- Sent (single checkmark) -->
    <svg v-else-if="status === 'sent'" 
      class="w-4 h-4 text-gray-400" 
      fill="currentColor" 
      viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
    </svg>

    <!-- Delivered (double checkmark gray) -->
    <div v-else-if="status === 'delivered'" class="relative w-4 h-4 text-gray-400">
      <!-- First checkmark -->
      <svg class="absolute w-4 h-4 transform -translate-x-0.5" 
        fill="currentColor" 
        viewBox="0 0 20 20">
        <g>
            <path fill-rule="evenodd" clip-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
            <path fill-rule="evenodd" clip-rule="evenodd"
            d="M14.707 3.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L6 10.586l7.293-7.293a1 1 0 011.414 0z"/>
        </g>
      </svg>
      <!-- Second checkmark (slightly offset) -->
      <svg class="absolute w-4 h-4 transform translate-x-0.5" 
        fill="currentColor" 
        viewBox="0 0 20 20">
        <g>
            <path fill-rule="evenodd" clip-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
            <path fill-rule="evenodd" clip-rule="evenodd"
            d="M14.707 3.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L6 10.586l7.293-7.293a1 1 0 011.414 0z"/>
        </g>
      </svg>
    </div>

    <!-- Read (double checkmark blue) -->
    <div v-else-if="status === 'read'" class="w-4 h-4 text-blue-500">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <g>
            <!-- First checkmark (sedikit ke kiri) -->
            <path fill-rule="evenodd" clip-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                transform="translate(-2,0)" />
            <!-- Second checkmark (utama, posisi normal) -->
            <path fill-rule="evenodd" clip-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
            </g>
        </svg>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MessageStatus } from '../../types/message-status';

const props = defineProps<{
  status: MessageStatus;
  showOnlyOutgoing?: boolean;
}>();

const statusText = computed(() => {
  switch (props.status) {
    case 'sending':
      return 'Mengirim...';
    case 'sent':
      return 'Terkirim';
    case 'delivered':
      return 'Tersampaikan';
    case 'read':
      return 'Dibaca';
    case 'failed':
      return 'Gagal terkirim';
    default:
      return '';
  }
});
</script>

<style scoped>
.message-status-icon {
  font-size: 0; /* Remove extra space */
}
</style>