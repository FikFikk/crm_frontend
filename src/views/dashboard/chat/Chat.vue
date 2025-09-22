<template>
  <DashboardLayout>
    <div class="intro-y flex flex-col sm:flex-row items-center mt-8">
      <div class="flex w-full items-center justify-between">
        <!-- Left: Chat Title -->
        <h2 class="text-lg font-medium flex-1 text-left">Chat</h2>
        <!-- Center: Connection Status -->
        <div class="flex-1 flex justify-center">
          <span class="px-2 py-1 text-xs rounded-full" :class="{
            'bg-green-100 text-green-800': waConnectionStatus === 'connected',
            'bg-yellow-100 text-yellow-800': waConnectionStatus === 'connecting',
            'bg-red-100 text-red-800': waConnectionStatus === 'disconnected'
          }">
            {{ waConnectionStatus === 'connected' ? 'WhatsApp Connected' : 
               waConnectionStatus === 'connecting' ? 'Connecting...' : 
               'WhatsApp Disconnected' }}
          </span>
        </div>
        <!-- Right: Start New Chat & Dropdown -->
        <div class="flex-1 flex justify-end items-center gap-2">
          <button class="btn btn-primary shadow-md">Start New Chat</button>
          <div class="dropdown">
            <button class="dropdown-toggle btn px-2 box text-slate-500" aria-expanded="false" data-tw-toggle="dropdown">
              <span class="w-5 h-5 flex items-center justify-center"> <i class="w-4 h-4" data-feather="plus"></i> </span>
            </button>
            <div class="dropdown-menu w-40">
              <ul class="dropdown-content">
                <li>
                  <a href="" class="dropdown-item"> <i data-feather="users" class="w-4 h-4 mr-2"></i> Create Group </a>
                </li>
                <li>
                  <a href="" class="dropdown-item"> <i data-feather="settings" class="w-4 h-4 mr-2"></i> Settings </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="intro-y chat grid grid-cols-12 gap-5 mt-5">
      <div class="col-span-4 xl:col-span-3">
        <ChatList ref="chatListRef" @select="handleSelectConversation" :selectedConversationId="selectedConversationId" />
      </div>
      <div class="col-span-8 xl:col-span-9">
        <ChatBox :conversationId="selectedConversationId" @message-sent="handleMessageSent" @opened="handleChatOpened" @mark-as-read="handleMarkAsRead" />
      </div>
    </div>
  </DashboardLayout>
</template>
<script setup lang="ts">

import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import DashboardLayout from '../../../components/Layout/DashboardLayout.vue';
import ChatBox from './ChatBox.vue';
import ChatList from './ChatList.vue';
import { useNotification } from '../../../composables/useNotification';
import { useSocket } from '../../../composables/useSocket';
import { whatsappService } from '../../../services/whatsapp-service';

const route = useRoute();
const { showAvatarNotification } = useNotification();
const selectedConversationId = ref<number | null>(null);
const chatListRef = ref<InstanceType<typeof ChatList>>();
const { waConnectionStatus, onSocket } = useSocket();

// Ambil company_id dari user yang login (localStorage)
function getCompanyIdFromUser(): number | null {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      // Cek struktur userObj, fallback ke 1 jika tidak ada
      if (userObj && userObj.user && userObj.user.company_id) {
        // console.log('[Chat.vue] Ambil company_id dari user.user.company_id:', userObj.user.company_id);
        return Number(userObj.user.company_id);
      }
      if (userObj && userObj.user && userObj.user.companyId) {
        // console.log('[Chat.vue] Ambil companyId dari user.user.companyId:', userObj.user.companyId);
        return Number(userObj.user.companyId);
      }
      if (userObj && userObj.company_id) {
        // console.log('[Chat.vue] Ambil company_id dari user.company_id:', userObj.company_id);
        return Number(userObj.company_id);
      }
      if (userObj && userObj.companyId) {
        // console.log('[Chat.vue] Ambil companyId dari user.companyId:', userObj.companyId);
        return Number(userObj.companyId);
      }
      // console.log('[Chat.vue] Struktur userObj tidak ditemukan company_id/companyId:', userObj);
    } else {
      // console.log('[Chat.vue] Tidak ada localStorage user');
    }
  } catch (err) {
    // console.log('[Chat.vue] Error parsing user from localStorage:', err);
  }
  return 1; // fallback default
}

// Pastikan status WhatsApp selalu sinkron dengan backend
async function checkWhatsAppStatus() {
  try {
    const COMPANY_ID = getCompanyIdFromUser() ?? 1;
    // console.log('[Chat.vue] Cek status WhatsApp untuk company_id:', COMPANY_ID);
    const statusRes = await whatsappService.getConnectionStatus(COMPANY_ID);
    // console.log('[Chat.vue] Hasil getConnectionStatus:', statusRes);
    if (statusRes && statusRes.connection_status) {
      waConnectionStatus.value = statusRes.connection_status;
    }
  } catch (e) {
    // console.log('[Chat.vue] Error checkWhatsAppStatus:', e);
    waConnectionStatus.value = 'disconnected';
  }
}

// Interface untuk response WhatsApp API
interface WhatsAppResponse {
  success: boolean;
  chat: {
    id: number;
    messageId: string;
    body: string;
    direction: 'in' | 'out';
    companyId: string;
    created: string;
    type?: string;
    imageURL?: string;
    videoURL?: string;
    audioURL?: string;
    documentURL?: string;
    locationLat?: string;
    locationLong?: string;
  };
  customer: {
    name: string;
    phone: string;
  };
  company: {
    id: string;
  };
}

function handleSelectConversation(conversationId: number) {
  selectedConversationId.value = conversationId;
  // KASUS 2: Mark conversation as read when selected
  if (chatListRef.value) {
    chatListRef.value.markConversationAsRead(conversationId);
  }
}

function handleMessageSent(messageData: { message: string, conversationId: number, messageId?: string, status?: string }) {
  if (chatListRef.value) {
    chatListRef.value.updateConversationLastMessage(
      messageData.conversationId,
      messageData.message,
      messageData.messageId,
      messageData.status
    );
  }
}

function handleChatOpened(convId: number) {
  // Safely call markConversationAsRead on ChatList ref when ChatBox reports it opened a conversation
  if (chatListRef && chatListRef.value && typeof chatListRef.value.markConversationAsRead === 'function') {
    try {
      chatListRef.value.markConversationAsRead(convId);
    } catch (e) {
      console.warn('[Chat.vue] Failed to mark conversation as read on ChatList ref', e);
    }
  }
}

function handleMarkAsRead(convId: number) {
  // Handle mark-as-read event from ChatBox - reset unread badge
  if (chatListRef && chatListRef.value && typeof chatListRef.value.markConversationAsRead === 'function') {
    try {
      chatListRef.value.markConversationAsRead(convId);
      console.log(`[Chat.vue] Marked conversation ${convId} as read`);
    } catch (e) {
      console.warn('[Chat.vue] Failed to mark conversation as read', e);
    }
  }
}

function handleIncomingWhatsAppMessage(response: WhatsAppResponse) {
  if (response.success && response.chat.direction === 'in') {
    let messageContent = response.chat.body;
    if (response.chat.type === 'image') {
      messageContent = '📷 ' + messageContent;
    } else if (response.chat.type === 'video') {
      messageContent = '🎥 ' + messageContent;
    } else if (response.chat.type === 'audio') {
      messageContent = '🎵 Audio Message';
    } else if (response.chat.type === 'document') {
      messageContent = '📄 ' + messageContent;
    } else if (response.chat.type === 'location') {
      messageContent = '📍 Location Shared';
    }
    showAvatarNotification(
      response.customer.name,
      messageContent,
      {
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(response.customer.name)}&background=3b82f6&color=ffffff`,
        onReply: () => {
          // Redirect ke chat dengan customer tersebut
          // selectedConversationId.value = response.customer.id; // jika ada customer ID
        }
      }
    );
    if (chatListRef.value) {
      // TODO: updateConversationLastMessage expects number, but phone is string. Adjust as needed.
      if (selectedConversationId.value !== null) {
        chatListRef.value.updateConversationLastMessage(
          selectedConversationId.value,
          messageContent
        );
      }
    }
  }
}

onMounted(() => {
  // KASUS 3: Check URL parameter for conversation ID
  const conversationParam = route.query.conversation;
  if (conversationParam && typeof conversationParam === 'string') {
    const convId = parseInt(conversationParam);
    if (!isNaN(convId)) {
      selectedConversationId.value = convId;
      // Mark as read when opened via URL
      if (chatListRef.value) {
        chatListRef.value.markConversationAsRead(convId);
      }
    }
  }
  
  // Cek status WhatsApp dari backend saat mount
  checkWhatsAppStatus();
  
  // Listen to socket events only once per component mount
  onSocket('message_received', (...args: unknown[]) => {
    const response = args[0] as WhatsAppResponse;
    handleIncomingWhatsAppMessage(response);
  });
  onSocket('message_sent', (...args: unknown[]) => {
    const response = args[0] as WhatsAppResponse;
    if (chatListRef.value && response.success) {
      if (selectedConversationId.value !== null) {
        chatListRef.value.updateConversationLastMessage(
          selectedConversationId.value,
          response.chat.body,
          response.chat.messageId,
          'delivered' // Default status for socket events
        );
      }
    }
  });
});
</script>