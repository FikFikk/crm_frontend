// src/composables/useSocket.ts
// Composable for managing a singleton Socket.IO connection across components
// Usage: import { useSocket } from '@/composables/useSocket'

import { ref, onUnmounted, getCurrentInstance } from 'vue';
import { io, type Socket } from 'socket.io-client';

const socketInstance = ref<Socket | null>(null);
const waConnectionStatus = ref<string>('disconnected');
const COMPANY_ID = '2'; // TODO: Replace with dynamic company ID from auth/session

// Event listeners registry for cleanup
const listeners: Array<{ event: string; handler: (...args: unknown[]) => void }> = [];

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

function connectSocket() {
  if (!socketInstance.value) {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });
    socketInstance.value = socket;

    socket.on('connect', () => {
      socket.emit('join_company', COMPANY_ID);
    });
    socket.on('disconnect', () => {
      waConnectionStatus.value = 'disconnected';
    });
    socket.on('connection_status', (data: { status: string }) => {
      waConnectionStatus.value = data.status;
    });
    socket.on('connection_error', () => {
      waConnectionStatus.value = 'disconnected';
    });
  }
}

function disconnectSocket() {
  if (socketInstance.value) {
    socketInstance.value.disconnect();
    socketInstance.value = null;
  }
}

function onSocket(event: string, handler: (...args: unknown[]) => void) {
  connectSocket();
  if (socketInstance.value) {
    socketInstance.value.on(event, handler);
    listeners.push({ event, handler });
  }
}

function offSocket(event: string, handler: (...args: unknown[]) => void) {
  if (socketInstance.value) {
    socketInstance.value.off(event, handler);
  }
}

function emitSocket(event: string, ...args: unknown[]) {
  connectSocket();
  socketInstance.value?.emit(event, ...args);
}

// Auto cleanup listeners on component unmount
function useSocket() {
  connectSocket();
  const instance = getCurrentInstance();
  if (instance) {
    onUnmounted(() => {
      // Remove all listeners registered by this composable instance
      listeners.forEach(({ event, handler }) => {
        socketInstance.value?.off(event, handler);
      });
    });
  }
  
  // Setup default message status listeners if socket is connected
  if (socketInstance.value) {
    // Listen for message delivery status from WhatsApp webhook
    socketInstance.value.on('message_delivery_status', (_data: Record<string, unknown>) => {
      // console.log('[Socket] Message delivery status:', data);
    });
    
    // Listen for message read receipts from WhatsApp webhook  
    socketInstance.value.on('message_read_receipt', (_data: Record<string, unknown>) => {
      // console.log('[Socket] Message read receipt:', data);
    });
    
    // Listen for message send confirmations
    socketInstance.value.on('message_send_confirmation', (_data: Record<string, unknown>) => {
      // console.log('[Socket] Message send confirmation:', data);
    });
  }
  
  return {
    socket: socketInstance,
    waConnectionStatus,
    onSocket,
    offSocket,
    emitSocket,
    disconnectSocket
  };
}

export { useSocket };