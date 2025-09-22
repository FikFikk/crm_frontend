<template>
  <!-- Area chat utama, header, pesan, input, emoji -->
  <div>
    <!-- BEGIN: Chat Content -->
    <div class="">
        <div class="chat__box box" style="height: 600px; margin-bottom: 4rem;">
            <!-- BEGIN: Chat Active -->
            <div v-if="conversationId && conversation" class="h-full flex flex-col">
                <div class="flex flex-row items-center border-b border-slate-200/60 dark:border-darkmode-400 px-5 py-4">
                  <div class="flex items-center flex-1 min-w-0">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 flex-none image-fit relative">
                        <img alt="Tinker Tailwind HTML Admin Template" class="rounded-full" src="/assets/dist/images/profile-7.jpg">
                    </div>
                    <div class="ml-3 mr-auto">
                        <div class="font-medium text-base">{{ conversation?.customer?.name }}</div>
                        <div class="text-slate-500 text-xs sm:text-sm">{{ conversation?.customer?.phone }}</div>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                  <!-- Search Button -->
                  <button @click="showSearch = !showSearch" class="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-700" title="Cari pesan">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="11" cy="11" r="8" stroke-width="2"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65" stroke-width="2"/>
                    </svg>
                  </button>
                  <!-- Reload Button -->
                  <button @click="fetchDetailChat" class="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-700" title="Reload chat">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.93 19.07A10 10 0 1 1 12 22v-4m0 4l-2-2m2 2l2-2" />
                    </svg>
                  </button>
                  <!-- Search Input (show on click) -->
                  <transition name="fade">
                    <input v-if="showSearch" v-model="searchMessage" @input="onSearchMessage" type="text" class="form-control w-40 h-8 text-xs" placeholder="Cari pesan..." autofocus style="transition:width 0.2s;" />
                  </transition>
                  <!-- Add/Manage Agent Button (only for pimpinan) -->
                  <button v-if="currentUser && currentUser.role === 'Pimpinan'" @click="showAddAgentModal = true" class="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-700" title="Tambah/Atur Agent">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <!-- Agent Management Modal (only for Pimpinan) -->
                  <div v-if="showAddAgentModal && currentUser && currentUser.role === 'Pimpinan'" class="absolute left-0 bottom-0 z-50 m-4 w-full max-w-xs sm:max-w-md">
                    <div class="bg-white dark:bg-darkmode-600 rounded-xl shadow-2xl w-full p-6 relative border border-slate-200 dark:border-darkmode-400 flex flex-col max-h-[80vh] overflow-y-auto">
                        <button class="absolute top-0 right-0 z-20 p-3 text-slate-400 hover:text-slate-700 focus:outline-none" @click="showAddAgentModal = false" title="Tutup">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                      <div class="mb-5 flex gap-2 border-b pb-3">
                        <button :class="['px-4 py-2 rounded-lg font-semibold transition', agentTab === 'involved' ? 'bg-primary text-white shadow' : 'bg-slate-100 dark:bg-darkmode-400 text-slate-700 dark:text-slate-200']" @click="agentTab = 'involved'">Involved Agents</button>
                        <button :class="['px-4 py-2 rounded-lg font-semibold transition', agentTab === 'add' ? 'bg-primary text-white shadow' : 'bg-slate-100 dark:bg-darkmode-400 text-slate-700 dark:text-slate-200']" @click="agentTab = 'add'">Add Agent</button>
                      </div>
                      <div v-if="agentTab === 'involved'">
                        <div v-if="involvedAgentsForModal.length">
                          <ul class="divide-y divide-slate-100 dark:divide-darkmode-400">
                            <li v-for="agent in involvedAgentsForModal" :key="agent.id" class="flex items-center justify-between py-3 px-2 hover:bg-slate-50 dark:hover:bg-darkmode-500 rounded-lg transition">
                              <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                                  <img v-if="agentService.getAgentPhotoUrl(agent)" :src="agentService.getAgentPhotoUrl(agent)" class="w-10 h-10 object-cover" alt="Agent" />
                                  <span v-else class="text-slate-400 text-lg font-bold">{{ agentService.getFullName(agent).charAt(0) }}</span>
                                </div>
                                <div>
                                  <div class="font-semibold text-base text-slate-700 dark:text-slate-100">{{ agentService.getFullName(agent) }}</div>
                                  <div class="text-xs text-slate-400">({{ agent.role }})</div>
                                </div>
                              </div>
                              <button v-if="canRemoveAgent(agent)" @click="removeAgent(agent)" class="text-red-500 hover:text-white hover:bg-red-500 border border-red-200 text-xs px-3 py-1 rounded-lg transition">Remove</button>
                            </li>
                          </ul>
                        </div>
                        <div v-else class="text-slate-400 text-center py-6">No agents involved.</div>
                      </div>
                      <div v-else-if="agentTab === 'add'">
                        <input v-model="agentSearchQuery" @input="onAgentSearch" type="text" class="form-control mb-4 px-4 py-2 rounded-lg border border-slate-200 dark:border-darkmode-400" placeholder="Cari agent..." />
                        <div class="max-h-44 md:max-h-56 overflow-y-auto">
                          <ul class="divide-y divide-slate-100 dark:divide-darkmode-400">
                            <li v-for="agent in filteredAgents" :key="agent.id" class="flex items-center justify-between py-3 px-2 hover:bg-slate-50 dark:hover:bg-darkmode-500 rounded-lg transition">
                              <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                                  <img v-if="agentService.getAgentPhotoUrl(agent)" :src="agentService.getAgentPhotoUrl(agent)" class="w-10 h-10 object-cover" alt="Agent" />
                                  <span v-else class="text-slate-400 text-lg font-bold">{{ agentService.getFullName(agent).charAt(0) }}</span>
                                </div>
                                <div>
                                  <div class="font-semibold text-base text-slate-700 dark:text-slate-100">{{ agentService.getFullName(agent) }}</div>
                                  <div class="text-xs text-slate-400">({{ agent.role }})</div>
                                </div>
                              </div>
                              <button @click="addAgent(agent)" class="text-primary border border-primary hover:text-white hover:bg-primary text-xs px-3 py-1 rounded-lg transition">Add</button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
                <div ref="messagesContainer" class="overflow-y-scroll scrollbar-hidden px-5 pt-5 flex-1" style="max-height: 400px;">
                  <template v-for="(group, index) in messageGroups" :key="index">
                    <!-- Date separator -->
                    <div class="flex justify-center mb-4">
                      <div class="px-3 py-1 bg-slate-200 dark:bg-darkmode-400 rounded-full text-xs text-slate-500">
                        {{ group.date }}
                      </div>
                    </div>
                    
                    <!-- Messages for this date -->
                    <div v-for="msg in group.messages" :key="msg.id" class="mb-4 flex" :class="msg.direction === 'in' ? 'justify-start' : 'justify-end'">
                      <div v-if="msg.direction === 'in'" class="w-10 h-10 flex-none image-fit relative mr-3">
                          <img alt="Profile" class="rounded-full" src="/assets/dist/images/profile-7.jpg">
                      </div>
                      <div :class="msg.direction === 'in' ? 'bg-slate-100 dark:bg-darkmode-400' : 'bg-primary text-white'" class="px-4 py-3 rounded-md relative max-w-md">
                        <!-- Media content -->
                        <div v-if="msg.type !== 'text'" class="mb-2">
                          <!-- Image -->
                          <!-- <div v-if="msg.type === 'image' && msg.imageURL" class="mb-2">
                            <img 
                              :src="getMediaUrl(msg.imageURL)" 
                              alt="Image message" 
                              class="max-w-full h-auto rounded-md cursor-pointer hover:opacity-90"
                              @click="openImageModal(getMediaUrl(msg.imageURL))"
                            >
                          </div> -->
                          <!-- Video -->
                          <!-- <div v-if="msg.type === 'video' && msg.videoURL" class="mb-2">
                            <video 
                              controls 
                              class="max-w-full h-auto rounded-md"
                              preload="metadata"
                            >
                              <source :src="getMediaUrl(msg.videoURL)" type="video/mp4">
                              Your browser does not support the video tag.
                            </video>
                          </div> -->
                          <!-- Audio -->
                          <!-- <div v-if="msg.type === 'audio' && msg.audioURL" class="mb-2">
                            <audio 
                              controls 
                              class="w-full"
                              preload="metadata"
                            >
                              <source :src="getMediaUrl(msg.audioURL)" type="audio/mpeg">
                              Your browser does not support the audio element.
                            </audio>
                          </div> -->
                          <!-- Document -->
                          <!-- <div v-if="msg.type === 'document' && msg.documentURL" class="mb-2">
                            <a 
                              :href="getMediaUrl(msg.documentURL)" 
                              download 
                              class="flex items-center gap-2 p-2 border rounded-md hover:bg-opacity-80"
                              :class="msg.direction === 'in' ? 'border-slate-300 hover:bg-slate-50' : 'border-white/30 hover:bg-white/10'"
                            >
                              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"/>
                              </svg>
                              <span class="text-sm">Document</span>
                            </a>
                          </div> -->
                          <!-- Location -->
                          <!-- <div v-if="msg.type === 'location' && msg.locationLat && msg.locationLong" class="mb-2">
                            <div class="p-2 border rounded-md" :class="msg.direction === 'in' ? 'border-slate-300' : 'border-white/30'">
                              <div class="flex items-center gap-2 mb-1">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 2C6.686 2 4 4.686 4 8c0 5.25 6 10 6 10s6-4.75 6-10c0-3.314-2.686-6-6-6zm0 8a2 2 0 100-4 2 2 0 000 4z"/>
                                </svg>
                                <span class="text-sm font-medium">Location</span>
                              </div>
                              <div class="text-xs opacity-75">
                                Lat: {{ msg.locationLat }}, Long: {{ msg.locationLong }}
                              </div>
                              <a 
                                :href="`https://maps.google.com/?q=${msg.locationLat},${msg.locationLong}`" 
                                target="_blank" 
                                class="text-xs underline mt-1 inline-block"
                              >
                                Open in Maps
                              </a>
                            </div>
                          </div> -->
                        </div>

                        <!-- Simple image display for image messages -->
                        <div v-if="msg.type === 'image' && msg.imageURL" class="mb-2">
                          <!-- <img :src="msg.imageURL" alt="Image" style="max-width:200px;max-height:200px;border-radius:8px;" /> -->
                          <img :src="'data:image/png;base64,' + msg.imageURL" alt="Image" style="max-width:200px;max-height:200px;border-radius:8px;" />
                        </div>
                        
                        <!-- Text content -->
                        <div v-if="msg.body" class="break-words">
                          {{ msg.body }}
                        </div>
                        
                        <div class="mt-1 flex flex-col items-start" :class="msg.direction === 'out' ? 'items-end' : 'items-start'">
                          <div class="flex items-center gap-1">
                            <div class="text-xs" :class="msg.direction === 'in' ? 'text-slate-500' : 'text-white/70'">{{ formatTime(msg.created) }}</div>
                            <!-- Message Status Icon (only for outgoing messages) -->
                            <MessageStatusIcon 
                              v-if="msg.direction === 'out'" 
                              :status="msg.status || 'sent'"
                              class="opacity-70"
                            />
                          </div>
                          <!-- Show agent name under outgoing messages (from agent, except Pimpinan) -->
                          <div v-if="msg.direction === 'out' && msg.agent && msg.agent.name && msg.agent.role !== 'pimpinan'" class="text-xs font-medium mt-1 text-white/70">
                            {{ msg.agent.name }}
                          </div>
                        </div>
                      </div>
                      <div v-if="msg.direction === 'out'" class="w-10 h-10 flex-none image-fit relative ml-3">
                          <img alt="Profile" class="rounded-full" src="/assets/dist/images/profile-7.jpg">
                      </div>
                    </div>
                  </template>
                </div>
                <div class="pt-4 pb-4 px-5 flex items-center gap-3 border-t border-slate-200/60 dark:border-darkmode-400">
                    <textarea ref="messageInput" v-model="messageText" class="flex-1 form-control border-transparent bg-slate-100 dark:bg-darkmode-600 resize-none px-4 py-3 shadow-none focus:border-transparent focus:ring-0 rounded-lg" rows="1" placeholder="Type your message..."></textarea>
                    
                    <div class="flex items-center gap-2">
                        <!-- Emoji Button -->
                        <ChatEmojis @emoji-selected="addEmoji" />
                        
                        <!-- Attachment Button -->
                        <button class="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-700">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                            </svg>
                        </button>
                        
                        <!-- Send Button -->
                        <button @click="sendMessage" class="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(90deg);">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <!-- END: Chat Active -->
            <!-- BEGIN: Chat Default -->
            <div v-else class="h-full flex items-center justify-center">
                <div class="text-center">
                    <div class="w-20 h-20 flex-none image-fit rounded-full overflow-hidden mx-auto mb-4 bg-slate-100">
                        <svg class="w-full h-full text-slate-400 p-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>
                        </svg>
                    </div>
                    <div class="font-medium text-lg mb-1">Select a conversation</div>
                    <div class="text-slate-500">Choose a chat from the list to start messaging</div>
                </div>
            </div>
            <!-- END: Chat Default -->
        </div>
    </div>
    <!-- END: Chat Content -->
    
    <!-- Image Modal -->
    <div v-if="showImageModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" @click="showImageModal = false">
      <div class="max-w-4xl max-h-4xl p-4" @click.stop>
        <img 
          :src="selectedImage" 
          alt="Full size image" 
          class="max-w-full max-h-full object-contain rounded-lg"
        >
        <button 
          @click="showImageModal = false"
          class="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold"
        >
          ×
        </button>
      </div>
    </div>
    
    <!-- <slot /> -->
  </div>
</template>


<script setup lang="ts">
import { ref, watch, computed, nextTick, onMounted } from 'vue';
import { chatService, type ConversationDetail, type ChatMessage } from '../../../services/chat-service';
// import { whatsappService } from '../../../services/whatsapp-service';
import ChatEmojis from './ChatEmojis.vue';
import MessageStatusIcon from '../../../components/ui/MessageStatusIcon.vue';
import { useSocket } from '../../../composables/useSocket';
import { useMessageStatus } from '../../../composables/useMessageStatus';
import { groupMessagesByDate } from '../../../utils/groupMessagesByDate';
import { formatTime } from '../../../utils/formatTime';

const { onSocket } = useSocket();
const { 
  markMessageSending, 
  markMessageSent, 
  markMessageDelivered, 
  markMessageRead,
  markMessageFailed,
  enrichMessagesWithStatus,
  setupStatusListeners
} = useMessageStatus();

// Ambil currentUser dari localStorage (auth context)
const currentUser = ref<{ role: string } | null>(null);
function loadCurrentUser() {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const userObj = JSON.parse(userStr);
      currentUser.value = userObj.user || null;
    } catch {
      currentUser.value = null;
    }
  } else {
    currentUser.value = null;
  }
}
loadCurrentUser();

const showSearch = ref(false);
const searchMessage = ref('');
function onSearchMessage() {}

const props = defineProps<{ conversationId: number | null }>();
const emit = defineEmits<{
  'message-sent': [messageData: { message: string, conversationId: number }],
  'opened': [conversationId: number]
}>();
const loading = ref(false);
const error = ref<string | null>(null);
const conversation = ref<ConversationDetail | null>(null);
// Tipe pesan pending (extend dari ChatMessage, tambahkan status?)
type PendingMessage = ChatMessage & { status?: string };
// Pending messages yang belum muncul di backend
const pendingMessages = ref<PendingMessage[]>([]);
const messageText = ref('');
const messageInput = ref<HTMLTextAreaElement | null>(null);
const messagesContainer = ref<HTMLDivElement | null>(null);

// Group messages by date
const messageGroups = computed(() => {
  if (!conversation.value?.messages) return [];
  return groupMessagesByDate(
    conversation.value.messages,
    enrichMessagesWithStatus,
    searchMessage.value
  );
});

// Function to scroll to bottom of messages
function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
}

async function fetchDetailChat() {
  if (!props.conversationId) {
    conversation.value = null;
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    const result = await chatService.getDetailChat(props.conversationId);
    // Enrich messages with status agar status centang tidak hilang setelah reload
    let backendMessages: PendingMessage[] = [];
    if (result.conversation && Array.isArray(result.conversation.messages)) {
      // Enrich dan pastikan id selalu number
      backendMessages = enrichMessagesWithStatus(result.conversation.messages).map(msg => ({
        ...msg,
        id: typeof msg.id === 'string' ? Number(msg.id) : msg.id
      })) as PendingMessage[];
    }
    // Gabungkan pendingMessages yang belum ada di backend
    const backendMsgIds = new Set(backendMessages.map(m => m.messageId));
    const stillPending = pendingMessages.value.filter(m => !backendMsgIds.has(m.messageId));
    // Buat urutan pesan: backend + pending yang belum ada di backend
    const allMessages = [...backendMessages, ...stillPending];
    if (!result.conversation) {
      result.conversation = {
        conversationId: String(props.conversationId ?? ''),
        customer: { id: 0, name: '', phone: '' },
        involvedAgents: [],
        totalMessages: allMessages.length,
        messages: allMessages
      };
    } else {
      result.conversation.messages = allMessages;
    }
    conversation.value = result.conversation;
    // Bersihkan pendingMessages yang sudah muncul di backend
    pendingMessages.value = pendingMessages.value.filter(m => !backendMsgIds.has(m.messageId));
    // Auto scroll to bottom when chat is loaded
    scrollToBottom();
    // Emit opened event so parent can mark conversation as read in the list
    emit('opened', props.conversationId);

    // --- Tambahan: Mark conversation as read (reset unread badge) ---
    // Emit socket event manual jika pakai socket.io
    if ((window as any)?.socket) {
      ((window as any).socket.emit) && (window as any).socket.emit('message_read', {
        conversationId: props.conversationId
      });
    }
    // --- END Tambahan ---
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load chat';
  } finally {
    loading.value = false;
  }
}

function addEmoji(emoji: string) {
  messageText.value += emoji;
  // Focus back to textarea after adding emoji
  messageInput.value?.focus();
}

async function sendMessage() {
  if (messageText.value.trim() && props.conversationId && conversation.value) {
    const message = messageText.value.trim();
    const messageId = generateMessageId();
    const now = new Date().toISOString();
    
    // KASUS 1: Langsung tambahkan pesan ke UI dengan status 'sending' (jamkot)
    const pendingMsg: PendingMessage = {
      id: Date.now(),
      messageId,
      body: message,
      direction: 'out',
      created: now,
      agent: {
        id: 1,
        name: '',
        role: 'agent'
      },
      status: 'sending'
    };
    conversation.value.messages.push(pendingMsg);
    pendingMessages.value.push(pendingMsg);
    markMessageSending(messageId);
    
    // Clear message input langsung setelah muncul di UI
    messageText.value = '';
    
    // Scroll to bottom untuk melihat pesan baru
    scrollToBottom();
    
    try {
      loading.value = true;
      
      // Get customer phone from conversation
      // const customerPhone = conversation.value.customer.phone;
      
      // Get API key from localStorage user
      // const userStr = localStorage.getItem('user');
      // let apiKey = '';
      // if (userStr) {
      //   try {
      //     const userObj = JSON.parse(userStr);
      //     apiKey = userObj.api_key || 'crm_e54c761e1dec987a98a0fdb593ff95dbd2fe5813'; // fallback to default
      //   } catch (e) {
      //     apiKey = 'crm_e54c761e1dec987a98a0fdb593ff95dbd2fe5813'; // fallback to default
      //   }
      // }
      
      // Send via WhatsApp service
      // await whatsappService.sendMessage({
      //   phone: customerPhone,
      //   message: message,
      //   api_key: apiKey,
      //   type: 'text'
      // });
      
      // Mark as sent (centang 1)
      markMessageSent(messageId);
      
      // Also send via chat service for internal tracking
      await chatService.sendMessage({
        conversationId: props.conversationId,
        message: message,
        messageId: messageId
      });
      
      // Mark as delivered (centang 2) setelah sukses kirim ke WhatsApp
      markMessageDelivered(messageId);
      
      // KASUS 1 FIX: Update conversation lastMessage tanpa reload
      if (conversation.value) {
        // Cast to any to avoid strict typing issues from backend DTO shape
        (conversation.value as any).lastMessage = {
          id: Date.now(),
          messageId,
          body: message,
          direction: 'outgoing',  
          created: now,
        };
      }
      
      // Emit the message-sent event for real-time ChatList updates
      emit('message-sent', {
        message: message,
        conversationId: props.conversationId
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      markMessageFailed(messageId);
    } finally {
      loading.value = false;
    }
  }
}

function generateMessageId(): string {
  return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

watch(() => props.conversationId, fetchDetailChat, { immediate: true });

// Listen for real-time updates for this conversation
onMounted(() => {
  // Setup message status listeners
  setupStatusListeners();
  
  onSocket('message_received', (response: any) => {
    if (
      response &&
      response.chat &&
      (
        (response.chat.conversationId && response.chat.conversationId === props.conversationId) ||
        // fallback: match by customer phone if conversationId not available
        (conversation.value && response.customer && response.customer.phone === conversation.value.customer.phone)
      )
    ) {
      fetchDetailChat();
    }
  });
  onSocket('message_sent', (response: any) => {
    if (
      response &&
      response.chat &&
      (
        (response.chat.conversationId && response.chat.conversationId === props.conversationId) ||
        (conversation.value && response.customer && response.customer.phone === conversation.value.customer.phone)
      )
    ) {
      fetchDetailChat();
    }
  });
  
  // Listen for message delivery confirmations from WhatsApp webhook
  onSocket('message_delivered_webhook', (response: any) => {
    if (response.messageId) {
      markMessageDelivered(response.messageId);
    }
  });
  
  // Listen for message read confirmations from WhatsApp webhook
  onSocket('message_read_webhook', (response: any) => {
    if (response.messageId) {
      markMessageRead(response.messageId);
    }
  });
});
// AGENT SEARCH & ADD UI LOGIC

import { agentService, type Agent } from '../../../services/agent-service';
// Helper: Map involvedAgents to Agent type for modal display
// (already imported computed above)
const involvedAgentsForModal = computed<Agent[]>(() => {
  return (conversation.value?.involvedAgents || []).map(a => ({
    id: a.id,
    firstName: a.name || '',
    surname: null,
    email: a.email || '',
    companyId: 0,
    phone: null,
    companyName: '',
    role: a.role || '',
    created: '',
  }));
});

const showAddAgentModal = ref(false);
const agentTab = ref<'involved' | 'add'>('involved');
const allAgents = ref<Agent[]>([]);
const filteredAgents = ref<Agent[]>([]);
const agentSearchQuery = ref('');

// Fetch all agents for add tab
async function fetchAllAgents() {
  try {
    allAgents.value = await agentService.getAgents();
    updateFilteredAgents();
  } catch (e) {}
}

function updateFilteredAgents() {
  // Exclude already involved agents
  const involvedIds = new Set((conversation.value?.involvedAgents || []).map(a => a.id));
  let agents = allAgents.value.filter(a => !involvedIds.has(a.id));
  // Hanya tampilkan agent dengan role 'agent' (case-insensitive)
  agents = agents.filter(a => a.role && a.role.toLowerCase() === 'agent');
  if (agentSearchQuery.value) {
    agents = agentService.searchAgents(agents, agentSearchQuery.value);
  }
  filteredAgents.value = agents;
}

function onAgentSearch() {
  updateFilteredAgents();
}

// Watch modal open to fetch agents
watch(showAddAgentModal, (val) => {
  if (val) {
    agentTab.value = 'involved';
    fetchAllAgents();
    agentSearchQuery.value = '';
  }
});

// Watch tab switch to update filtered list
watch(agentTab, (tab) => {
  if (tab === 'add') updateFilteredAgents();
});

// Add agent to conversation
async function addAgent(agent: Agent) {
  if (!props.conversationId) return;
  try {
    await chatService.addAgentToConversation(props.conversationId, agent.id);
    await fetchDetailChat();
    agentTab.value = 'involved';
    updateFilteredAgents();
  } catch (e) {
    // handle error
  }
}

// Remove agent from conversation
async function removeAgent(agent: Agent) {
  if (!props.conversationId) return;
  try {
    await chatService.removeAgentFromConversation(props.conversationId, agent.id);
    await fetchDetailChat();
    updateFilteredAgents();
  } catch (e) {
    // handle error
  }
}

// Only allow remove if not primary agent (or add your own logic)
function canRemoveAgent(_agent: Agent) {
  return true;
}

// Media handling functions
const showImageModal = ref(false);
const selectedImage = ref<string>('');

function getMediaUrl(mediaUrl: string): string {
  if (!mediaUrl) return '';
  
  // If it's already a full URL, return as is
  if (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')) {
    return mediaUrl;
  }
  
  // If it's base64 data
  if (mediaUrl.startsWith('data:')) {
    return mediaUrl;
  }
  
  // If it's just base64 string, add proper data URL prefix
  if (mediaUrl.length > 100) {
    // Assume it's base64 image if long string
    return `data:image/jpeg;base64,${mediaUrl}`;
  }
  
  // Otherwise assume it's a relative path
  return mediaUrl;
}

function openImageModal(imageUrl: string) {
  selectedImage.value = imageUrl;
  showImageModal.value = true;
}

// Prevent "declared but its value is never read" TypeScript warnings in template-less usage
/* istanbul ignore next */
void getMediaUrl;
/* istanbul ignore next */
void openImageModal;

</script>