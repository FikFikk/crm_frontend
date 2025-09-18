// src/types/message-status.ts
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface MessageWithStatus {
  id: number | string;
  messageId: string;
  body: string;
  direction: 'incoming' | 'outgoing';
  created: string;
  byAgent?: boolean;
  status?: MessageStatus;
  timestamp?: number;
}

export interface MessageStatusUpdate {
  messageId: string;
  conversationId: number;
  status: MessageStatus;
  timestamp?: number;
}

export interface MessageStatusEvent {
  event: 'message_status_update';
  messageId: string;
  conversationId: number;
  status: MessageStatus;
  timestamp: number;
}