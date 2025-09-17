// src/composables/useNotification.ts
import { ref } from 'vue'

export interface SuccessNotification {
  id: string
  type: 'success'
  title: string
  message?: string
  duration?: number
}

export interface AvatarNotification {
  id: string
  type: 'avatar'
  customerName: string
  message: string
  avatarUrl?: string
  showReplyButton?: boolean
  onReply?: () => void
  duration?: number
}

export type Notification = SuccessNotification | AvatarNotification

const notifications = ref<Notification[]>([])

let notificationId = 0

function generateId(): string {
  return `notification-${++notificationId}-${Date.now()}`
}

export function useNotification() {
  const showSuccessNotification = (
    title: string,
    message?: string,
    duration: number = 5000
  ) => {
    const notification: SuccessNotification = {
      id: generateId(),
      type: 'success',
      title,
      message,
      duration
    }

    notifications.value.push(notification)

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(notification.id)
      }, duration)
    }

    return notification.id
  }

  const showAvatarNotification = (
    customerName: string,
    message: string,
    options: {
      avatarUrl?: string
      showReplyButton?: boolean
      onReply?: () => void
      duration?: number
    } = {}
  ) => {
    const notification: AvatarNotification = {
      id: generateId(),
      type: 'avatar',
      customerName,
      message,
      avatarUrl: options.avatarUrl,
      showReplyButton: options.showReplyButton ?? true,
      onReply: options.onReply,
      duration: options.duration ?? 0 // Avatar notifications don't auto-dismiss by default
    }

    notifications.value.push(notification)

    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        removeNotification(notification.id)
      }, notification.duration)
    }

    return notification.id
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearAllNotifications = () => {
    notifications.value = []
  }

  return {
    notifications,
    showSuccessNotification,
    showAvatarNotification,
    removeNotification,
    clearAllNotifications
  }
}

export {}