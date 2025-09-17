import { Ref } from 'vue'

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

export declare function useNotification(): {
  notifications: Ref<Notification[]>
  showSuccessNotification: (
    title: string,
    message?: string,
    duration?: number
  ) => string
  showAvatarNotification: (
    customerName: string,
    message: string,
    options?: {
      avatarUrl?: string
      showReplyButton?: boolean
      onReply?: () => void
      duration?: number
    }
  ) => string
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
}
