// src/composables/useMessageStatus.ts
import { reactive } from 'vue';
import type { MessageStatus, MessageStatusUpdate, MessageWithStatus } from '../types/message-status';
import { useSocket } from './useSocket';

const { onSocket, emitSocket } = useSocket();

// Global message status registry
const messageStatusRegistry = reactive<Map<string, MessageStatus>>(new Map());

export function useMessageStatus() {
  
  /**
   * Update status pesan lokal
   */
  const updateMessageStatus = (messageId: string, status: MessageStatus) => {
    messageStatusRegistry.set(messageId, status);
    console.log(`[MessageStatus] Updated ${messageId} to ${status}`);
  };

  /**
   * Get status pesan
   */
  const getMessageStatus = (messageId: string): MessageStatus => {
    return messageStatusRegistry.get(messageId) || 'sent';
  };

  /**
   * Set status pesan ke 'sending' saat mulai kirim
   */
  const markMessageSending = (messageId: string) => {
    updateMessageStatus(messageId, 'sending');
  };

  /**
   * Set status pesan ke 'sent' saat berhasil terkirim ke server
   */
  const markMessageSent = (messageId: string) => {
    updateMessageStatus(messageId, 'sent');
  };

  /**
   * Set status pesan ke 'delivered' saat terkirim ke WhatsApp
   */
  const markMessageDelivered = (messageId: string) => {
    updateMessageStatus(messageId, 'delivered');
  };

  /**
   * Set status pesan ke 'read' saat dibaca oleh penerima
   */
  const markMessageRead = (messageId: string) => {
    updateMessageStatus(messageId, 'read');
  };

  /**
   * Set status pesan ke 'failed' saat gagal terkirim
   */
  const markMessageFailed = (messageId: string) => {
    updateMessageStatus(messageId, 'failed');
  };

  /**
   * Broadcast status update via socket
   */
  const broadcastStatusUpdate = (conversationId: number, messageId: string, status: MessageStatus) => {
    const statusUpdate: MessageStatusUpdate = {
      messageId,
      conversationId,
      status,
      timestamp: Date.now()
    };
    
    emitSocket('message_status_update', statusUpdate);
  };

  /**
   * Setup socket listeners untuk status update
   */
  const setupStatusListeners = () => {
    // Listen untuk update status dari server/socket
    onSocket('message_status_update', (data: MessageStatusUpdate) => {
      console.log('[MessageStatus] Received status update:', data);
      updateMessageStatus(data.messageId, data.status);
    });

    // Listen untuk konfirmasi pengiriman
    onSocket('message_sent_confirmation', (data: any) => {
      if (data.messageId) {
        markMessageSent(data.messageId);
      }
    });

    // Listen untuk konfirmasi delivery
    onSocket('message_delivered', (data: any) => {
      if (data.messageId) {
        markMessageDelivered(data.messageId);
      }
    });

    // Listen untuk konfirmasi read
    onSocket('message_read', (data: any) => {
      if (data.messageId) {
        markMessageRead(data.messageId);
      }
    });

    // Listen untuk failure
    onSocket('message_failed', (data: any) => {
      if (data.messageId) {
        markMessageFailed(data.messageId);
      }
    });
  };

  /**
   * Add status property to messages
   */
  const enrichMessagesWithStatus = (messages: any[]): MessageWithStatus[] => {
    return messages.map(msg => ({
      ...msg,
      status: getMessageStatus(msg.messageId)
    }));
  };

  /**
   * Clear old message statuses (cleanup)
   */
  const clearOldStatuses = () => {
    // Clear all statuses if registry gets too large
    if (messageStatusRegistry.size > 1000) {
      messageStatusRegistry.clear();
    }
  };

  return {
    // State
    messageStatusRegistry,
    
    // Status getters/setters
    updateMessageStatus,
    getMessageStatus,
    
    // Status markers
    markMessageSending,
    markMessageSent,
    markMessageDelivered,
    markMessageRead,
    markMessageFailed,
    
    // Socket functions
    broadcastStatusUpdate,
    setupStatusListeners,
    
    // Utility functions
    enrichMessagesWithStatus,
    clearOldStatuses
  };
}