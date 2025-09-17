<!-- src/components/ui/NotificationSuccess.vue -->
<template>
  <div class="toastify-content flex" :class="{ 'hidden': !show }">
    <i class="text-success" data-feather="check-circle"></i> 
    <div class="ml-4 mr-4">
      <div class="font-medium">{{ title }}</div>
      <div class="text-slate-500 mt-1" v-if="message">{{ message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'

interface Props {
  title?: string
  message?: string
  show?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Success!',
  message: '',
  show: true
})
</script>

<style scoped>
.text-success {
  color: #10b981;
}

.toastify-content {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  min-width: 300px;
  max-width: 400px;
  margin-bottom: 8px;
}

.font-medium {
  font-weight: 500;
}

.text-slate-500 {
  color: #64748b;
}

.ml-4 {
  margin-left: 1rem;
}

.mr-4 {
  margin-right: 1rem;
}

.mt-1 {
  margin-top: 0.25rem;
}

/* Icon styles using CSS instead of feather icons */
i[data-feather="check-circle"]::before {
  content: "✓";
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #10b981;
  color: white;
  text-align: center;
  line-height: 20px;
  font-size: 14px;
  font-weight: bold;
}
</style>