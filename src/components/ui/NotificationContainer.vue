<!-- src/components/ui/NotificationContainer.vue -->
<template>
  <Teleport to="body">
    <div class="notification-container">
      <TransitionGroup
        name="notification"
        tag="div"
        class="notification-list"
      >
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-item"
        >
          <!-- Success Notification -->
          <NotificationSuccess
            v-if="notification.type === 'success'"
            :title="notification.title"
            :message="notification.message"
            @click="removeNotification(notification.id)"
          />
          
          <!-- Avatar Notification -->
          <NotificationAvatar
            v-else-if="notification.type === 'avatar'"
            :customer-name="notification.customerName"
            :message="notification.message"
            :avatar-url="notification.avatarUrl"
            :show-reply-button="notification.showReplyButton"
            @reply="handleReply(notification)"
            @click="removeNotification(notification.id)"
          />
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useNotification, type AvatarNotification } from '../../composables/useNotification'
import NotificationSuccess from './NotificationSuccess.vue'
import NotificationAvatar from './NotificationAvatar.vue'

const { notifications, removeNotification } = useNotification()

const handleReply = (notification: AvatarNotification) => {
  if (notification.onReply) {
    notification.onReply()
  }
  // Optionally remove the notification after replying
  removeNotification(notification.id)
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notification-item {
  pointer-events: auto;
  cursor: pointer;
}

/* Transition animations */
.notification-enter-active {
  transition: all 0.3s ease-out;
}

.notification-leave-active {
  transition: all 0.3s ease-in;
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.notification-move {
  transition: transform 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .notification-container {
    top: 10px;
    right: 10px;
    left: 10px;
    width: auto;
  }
  
  .notification-item {
    width: 100%;
  }
}
</style>