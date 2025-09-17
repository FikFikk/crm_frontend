// src/examples/NotificationExamples.vue
<template>
  <div class="notification-examples p-8">
    <h1 class="text-2xl font-bold mb-6">Notification System Examples</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Success Notifications -->
      <div class="example-section">
        <h2 class="text-xl font-semibold mb-4">Success Notifications</h2>
        <div class="space-y-2">
          <button
            @click="showSimpleSuccess"
            class="btn btn-primary w-full"
          >
            Simple Success
          </button>
          
          <button
            @click="showSuccessWithMessage"
            class="btn btn-primary w-full"
          >
            Success with Message
          </button>
          
          <button
            @click="showCustomDurationSuccess"
            class="btn btn-primary w-full"
          >
            Custom Duration (2s)
          </button>
        </div>
      </div>
      
      <!-- Avatar Notifications -->
      <div class="example-section">
        <h2 class="text-xl font-semibold mb-4">Avatar Notifications (Customer Messages)</h2>
        <div class="space-y-2">
          <button
            @click="showCustomerMessage"
            class="btn btn-secondary w-full"
          >
            Customer Message
          </button>
          
          <button
            @click="showCustomerWithCustomAvatar"
            class="btn btn-secondary w-full"
          >
            Custom Avatar Message
          </button>
          
          <button
            @click="showCustomerNoReply"
            class="btn btn-secondary w-full"
          >
            Message without Reply Button
          </button>
          
          <button
            @click="showAutoDismissMessage"
            class="btn btn-secondary w-full"
          >
            Auto Dismiss Message (5s)
          </button>
        </div>
      </div>
    </div>
    
    <div class="mt-8">
      <button
        @click="clearAll"
        class="btn btn-outline-danger"
      >
        Clear All Notifications
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotification } from '../composables/useNotification'

const { 
  showSuccessNotification, 
  showAvatarNotification, 
  clearAllNotifications 
} = useNotification()

// Success notification examples
const showSimpleSuccess = () => {
  showSuccessNotification('Success!')
}

const showSuccessWithMessage = () => {
  showSuccessNotification(
    'Data Saved!',
    'Your changes have been saved successfully.'
  )
}

const showCustomDurationSuccess = () => {
  showSuccessNotification(
    'Quick Success!',
    'This notification will disappear in 2 seconds.',
    2000
  )
}

// Avatar notification examples
const showCustomerMessage = () => {
  showAvatarNotification(
    'John Doe',
    'Hi! I need help with my order. Can you assist me?',
    {
      onReply: () => {
        alert('Opening chat with John Doe...')
        // Here you would typically open the chat interface
      }
    }
  )
}

const showCustomerWithCustomAvatar = () => {
  showAvatarNotification(
    'Sarah Wilson',
    'Thank you for the quick response! 😊',
    {
      avatarUrl: 'https://via.placeholder.com/40x40/FF6B6B/FFFFFF?text=SW',
      onReply: () => {
        alert('Opening chat with Sarah Wilson...')
      }
    }
  )
}

const showCustomerNoReply = () => {
  showAvatarNotification(
    'System',
    'Customer "Mike Johnson" has been automatically assigned to you.',
    {
      showReplyButton: false,
      avatarUrl: 'https://via.placeholder.com/40x40/4ECDC4/FFFFFF?text=S'
    }
  )
}

const showAutoDismissMessage = () => {
  showAvatarNotification(
    'Emma Thompson',
    'This message will auto-dismiss in 5 seconds.',
    {
      duration: 5000,
      onReply: () => {
        alert('Opening chat with Emma Thompson...')
      }
    }
  )
}

const clearAll = () => {
  clearAllNotifications()
}
</script>

<style scoped>
.notification-examples {
  max-width: 800px;
  margin: 0 auto;
}

.example-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #64748b;
  color: white;
}

.btn-secondary:hover {
  background-color: #475569;
}

.btn-outline-danger {
  background-color: transparent;
  color: #dc2626;
  border: 1px solid #dc2626;
}

.btn-outline-danger:hover {
  background-color: #dc2626;
  color: white;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}

.w-full {
  width: 100%;
}

.text-2xl {
  font-size: 1.5rem;
}

.text-xl {
  font-size: 1.25rem;
}

.font-bold {
  font-weight: 700;
}

.font-semibold {
  font-weight: 600;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mt-8 {
  margin-top: 2rem;
}

.p-8 {
  padding: 2rem;
}

.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.gap-6 {
  gap: 1.5rem;
}
</style>