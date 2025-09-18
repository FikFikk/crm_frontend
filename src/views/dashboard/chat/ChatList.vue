<template>
  <div>
    <!-- BEGIN: Chat Side Menu -->
    <div class="">
        <!-- <div class="intro-y pr-1">
            <div class="box p-2">
                <ul class="nav nav-pills" role="tablist">
                    <li id="chats-tab" class="nav-item flex-1" role="presentation">
                        <button class="nav-link w-full py-2 active" data-tw-toggle="pill" data-tw-target="#chats" type="button" role="tab" aria-controls="chats" aria-selected="true" > Chats </button>
                    </li>
                    <li id="friends-tab" class="nav-item flex-1" role="presentation">
                        <button class="nav-link w-full py-2" data-tw-toggle="pill" data-tw-target="#friends" type="button" role="tab" aria-controls="friends" aria-selected="false" > Friends </button>
                    </li>
                    <li id="profile-tab" class="nav-item flex-1" role="presentation">
                        <button class="nav-link w-full py-2" data-tw-toggle="pill" data-tw-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false" > Profile </button>
                    </li>
                </ul>
            </div>
        </div> -->
        <div class="tab-content">
            <div id="chats" class="tab-pane active" role="tabpanel" aria-labelledby="chats-tab">
                <div class="pr-1">
                    <div class="box px-5 py-5 pt-5 pb-5 lg:pb-0">
                        <div class="relative text-slate-500">
                            <input v-model="search" type="text" class="form-control py-3 px-4 border-transparent bg-slate-100 pr-10" placeholder="Search for messages or users...">
                            <i class="w-4 h-4 hidden sm:absolute my-auto inset-y-0 mr-3 right-0" data-feather="search"></i> 
                        </div>
                    </div>
                </div>
                <div class="chat__chat-list overflow-y-auto scrollbar-hidden pr-1 pt-1 mt-4" style="height: 500px;">
                  <div v-if="loading" class="text-center py-4 text-slate-400">Loading chats...</div>
                  <div v-else-if="error" class="text-center py-4 text-danger">{{ error }}</div>
                  <template v-else>
                    <div v-for="conv in filteredConversations" :key="conv.conversationId"
                      class="intro-x cursor-pointer box relative flex items-center p-3 pt-6 pb-6 mb-2"
                      :class="{ 'ring-2 ring-primary': conv.conversationId === selectedConversationId }"
                      @click="handleSelect(conv.conversationId)">
                      <div class="w-12 h-12 flex-none image-fit mr-1">
                        <img alt="Profile" class="rounded-full" src="/assets/dist/images/profile-7.jpg">
                        <div class="w-3 h-3 bg-success absolute right-0 bottom-0 rounded-full border-2 border-white dark:border-darkmode-600"></div>
                      </div>
                      <div class="ml-2 overflow-hidden">
                        <div class="flex items-center">
                          <a href="javascript:;" class="font-medium mr-1">{{ conv.customer.name }}</a>
                          <div class="text-xs text-slate-400 ml-auto">{{ formatTime(conv.lastMessage.created) }}</div>
                        </div>
                        <div class="w-full truncate text-slate-500 mt-0.5">{{ conv.lastMessage.body }}</div>
                      </div>
                      <div v-if="conv.totalMessages > 1" class="w-5 h-5 flex items-center justify-center absolute top-0 right-0 text-xs text-white rounded-full bg-primary font-medium -mt-1 -mr-1">{{ conv.totalMessages }}</div>
                    </div>
                  </template>
                </div>
            </div>
        </div>
    </div>
    <!-- END: Chat Side Menu -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { chatService, type Conversation } from '../../../services/chat-service';
import { useSocket } from '../../../composables/useSocket';

const { onSocket } = useSocket();

const props = defineProps<{ selectedConversationId?: number | null }>();
const conversations = ref<Conversation[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const search = ref('');

const emit = defineEmits<{
  select: [conversationId: number]
}>();

const loadConversations = async () => {
  loading.value = true;
  error.value = null;
  try {
    conversations.value = await chatService.getConversations();
  } catch (e) {
    console.error('Error in loadConversations:', e);
    
    // Convert error to string for checking
    const errorMessage = e instanceof Error ? e.message : String(e);
    
    // Handle specific cases where agent has no chats - don't show as error
    if (errorMessage.includes('Cannot filter') && errorMessage.includes('empty set')) {
      console.log('Agent has no conversations, showing empty state');
      conversations.value = [];
      error.value = null; // Don't show error, just empty state
    } else if (errorMessage.includes('500') && errorMessage.includes('CustomerID')) {
      console.log('Agent has no conversations (500 error), showing empty state');
      conversations.value = [];
      error.value = null; // Don't show error, just empty state  
    } else {
      // Only show error for actual connection/server issues
      error.value = 'Terjadi masalah saat memuat percakapan. Silakan coba lagi.';
    }
  } finally {
    loading.value = false;
  }
};

// Function to update a specific conversation's last message
const updateConversationLastMessage = (conversationId: number, messageText: string) => {
  const conversationIndex = conversations.value.findIndex(conv => conv.conversationId === conversationId);
  if (conversationIndex !== -1) {
    // Create a proper message object with current timestamp
    conversations.value[conversationIndex].lastMessage = {
      id: Date.now(), // Temporary ID
      messageId: `msg_${Date.now()}`,
      body: messageText,
      direction: 'outgoing',
      created: new Date().toISOString(),
      byAgent: undefined // Since it's sent by user, not by agent
    };
    conversations.value[conversationIndex].totalMessages += 1;
    
    // Move conversation to top of the list for better UX
    const updatedConv = conversations.value.splice(conversationIndex, 1)[0];
    conversations.value.unshift(updatedConv);
  }
};

// Expose functions to parent component
defineExpose({
  loadConversations,
  updateConversationLastMessage
});

const filteredConversations = computed(() => {
  if (!search.value) return conversations.value;
  const q = search.value.toLowerCase();
  return conversations.value.filter(conv =>
    conv.customer.name.toLowerCase().includes(q) ||
    conv.lastMessage.body.toLowerCase().includes(q)
  );
});

function formatTime(dateStr: string) {
  const messageDate = new Date(dateStr);
  if (isNaN(messageDate.getTime())) {
    return 'Invalid Date';
  }
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDate = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
  
  const diffTime = today.getTime() - msgDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Today - show time with AM/PM
    return messageDate.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  } else if (diffDays === 1) {
    // Yesterday
    return 'Kemarin';
  } else if (diffDays >= 2 && diffDays <= 7) {
    // Show day name for 2-7 days ago
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return dayNames[messageDate.getDay()];
  } else {
    // More than 7 days - show date format DD/MM/YY
    const day = messageDate.getDate().toString().padStart(2, '0');
    const month = (messageDate.getMonth() + 1).toString().padStart(2, '0');
    const year = messageDate.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  }
}

function handleSelect(conversationId: number) {
  console.log('[ChatList] emit select:', conversationId);
  emit('select', conversationId);
}

watch(() => props.selectedConversationId, (val) => {
  console.log('[ChatList] selectedConversationId prop changed:', val);
});

onMounted(() => {
  loadConversations();
  // Listen for real-time updates
  onSocket('message_received', (response: any) => {
    if (response && response.chat && response.customer) {
      const convId = response.chat.conversationId;
      if (convId) {
        const idx = conversations.value.findIndex(conv => conv.conversationId === convId);
        if (idx !== -1) {
          conversations.value[idx].lastMessage = {
            id: response.chat.id || Date.now(),
            messageId: response.chat.messageId || `msg_${Date.now()}`,
            body: response.chat.body,
            direction: response.chat.direction || 'incoming',
            created: response.chat.created || new Date().toISOString(),
            byAgent: response.chat.byAgent
          };
          conversations.value[idx].totalMessages = (conversations.value[idx].totalMessages || 0) + 1;
        } else {
          // Tambahkan percakapan baru ke list jika belum ada, pastikan semua properti Conversation terisi
          conversations.value.unshift({
            conversationId: convId,
            customerId: response.customer?.id || 0,
            customer: response.customer || { id: 0, name: '', phone: '' },
            involvedAgents: response.involvedAgents || [],
            primaryAgent: response.primaryAgent || { id: 0, name: '', role: '' },
            lastMessage: {
              id: response.chat.id || Date.now(),
              messageId: response.chat.messageId || `msg_${Date.now()}`,
              body: response.chat.body,
              direction: response.chat.direction || 'incoming',
              created: response.chat.created || new Date().toISOString(),
              byAgent: response.chat.byAgent
            },
            totalMessages: 1
          });
        }
      }
    }
  });
  onSocket('message_sent', (response: any) => {
    if (response && response.chat && response.customer) {
      const convId = response.chat.conversationId;
      if (convId) {
        const idx = conversations.value.findIndex(conv => conv.conversationId === convId);
        if (idx !== -1) {
          conversations.value[idx].lastMessage = {
            id: response.chat.id || Date.now(),
            messageId: response.chat.messageId || `msg_${Date.now()}`,
            body: response.chat.body,
            direction: response.chat.direction || 'outgoing',
            created: response.chat.created || new Date().toISOString(),
            byAgent: response.chat.byAgent
          };
          conversations.value[idx].totalMessages = (conversations.value[idx].totalMessages || 0) + 1;
        } else {
          // Tambahkan percakapan baru ke list jika belum ada, pastikan semua properti Conversation terisi
          conversations.value.unshift({
            conversationId: convId,
            customerId: response.customer?.id || 0,
            customer: response.customer || { id: 0, name: '', phone: '' },
            involvedAgents: response.involvedAgents || [],
            primaryAgent: response.primaryAgent || { id: 0, name: '', role: '' },
            lastMessage: {
              id: response.chat.id || Date.now(),
              messageId: response.chat.messageId || `msg_${Date.now()}`,
              body: response.chat.body,
              direction: response.chat.direction || 'outgoing',
              created: response.chat.created || new Date().toISOString(),
              byAgent: response.chat.byAgent
            },
            totalMessages: 1
          });
        }
      }
    }
  });
});
</script>
