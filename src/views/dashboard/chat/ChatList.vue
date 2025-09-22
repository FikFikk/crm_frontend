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
                <div class="pr-1 mb-2">
                  <div class="box px-5 py-4">
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
                      <div class="ml-2 overflow-hidden flex-1">
                        <div class="flex items-center justify-between">
                          <a href="javascript:;" class="font-medium truncate">{{ conv.customer.name }}</a>
                          <div class="text-xs text-slate-400 ml-auto">{{ formatTimeChatList(conv.lastMessage.created) }}</div>
                        </div>
                        <div class="flex items-center gap-1 w-full mt-0.5">
                          <div class="truncate text-slate-500 text-sm flex-1">{{ conv.lastMessage.body }}</div>
                          <!-- Show status icon only for outgoing messages -->
                          <MessageStatusIcon 
                            v-if="conv.lastMessage.direction === 'outgoing'" 
                            :status="getMessageStatus(conv.lastMessage.messageId) || 'sent'"
                            class="flex-shrink-0 opacity-70"
                          />
                        </div>
                      </div>
                      <!-- KASUS 2: Show unread count badge instead of total messages -->
                      <div v-if="getUnreadCount(conv.conversationId) > 0" class="w-5 h-5 flex items-center justify-center absolute top-0 right-0 text-xs text-white rounded-full bg-primary font-medium -mt-1 -mr-1">{{ getUnreadCount(conv.conversationId) }}</div>
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
import { useMessageStatus } from '../../../composables/useMessageStatus';
import MessageStatusIcon from '../../../components/ui/MessageStatusIcon.vue';

const { onSocket } = useSocket();
const { getMessageStatus } = useMessageStatus();

const props = defineProps<{ selectedConversationId?: number | null }>();
const conversations = ref<Conversation[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const search = ref('');
const unreadCounts = ref<Map<number, number>>(new Map()); // Track unread messages per conversation

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
      // console.log('Agent has no conversations, showing empty state');
      conversations.value = [];
      error.value = null; // Don't show error, just empty state
    } else if (errorMessage.includes('500') && errorMessage.includes('CustomerID')) {
      // console.log('Agent has no conversations (500 error), showing empty state');
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

// KASUS 2: Functions untuk menangani unread count
const normalizeId = (id: number | string | undefined | null): number | null => {
  if (id === undefined || id === null) return null;
  const n = Number(id);
  return Number.isNaN(n) ? null : n;
};

const markConversationAsRead = (conversationId: number | string) => {
  const id = normalizeId(conversationId);
  if (id === null) return;
  unreadCounts.value.set(id, 0);
};

const incrementUnreadCount = (conversationId: number | string) => {
  const id = normalizeId(conversationId);
  if (id === null) return;
  const currentCount = unreadCounts.value.get(id) || 0;
  unreadCounts.value.set(id, currentCount + 1);
};

const getUnreadCount = (conversationId: number | string): number => {
  const id = normalizeId(conversationId);
  if (id === null) return 0;
  return unreadCounts.value.get(id) || 0;
};

// Expose functions to parent component
defineExpose({
  loadConversations,
  updateConversationLastMessage,
  markConversationAsRead
});

const filteredConversations = computed(() => {
  if (!search.value) return conversations.value;
  const q = search.value.toLowerCase();
  return conversations.value.filter(conv =>
    conv.customer.name.toLowerCase().includes(q) ||
    conv.lastMessage.body.toLowerCase().includes(q)
  );
});


import { formatTimeChatList } from '../../../utils/formatTimeChatList';

// Use formatTimeChatList from utility file

function handleSelect(conversationId: number) {
  // console.log('[ChatList] emit select:', conversationId);
  // KASUS 2: Mark conversation as read ketika diklik
  markConversationAsRead(conversationId);
  emit('select', conversationId);
}

// Clear unread when parent selects a conversation (ensure numeric comparison)
watch(() => props.selectedConversationId, (val) => {
  // If a conversation is selected, mark it as read locally
  if (val !== undefined && val !== null) {
    const convId = Number(val);
    if (!Number.isNaN(convId)) {
      markConversationAsRead(convId);
    }
  }
});

onMounted(() => {
  loadConversations();
  // Listen for real-time updates
  onSocket('message_received', (...args: unknown[]) => {
    const response = args[0] as Record<string, unknown>;
    if (response && response.chat && response.customer) {
      // Normalize conversation id to number to avoid type mismatches
      const chat = response.chat as Record<string, unknown>;
      const rawId = chat.conversationId ?? chat.conversation_id ?? chat.convId;
      const convId = Number(rawId);
      if (Number.isNaN(convId)) return;

      const isIncoming = (chat.direction === 'in' || chat.direction === 'incoming' || !chat.direction);

      const idx = conversations.value.findIndex(conv => Number(conv.conversationId) === convId);
      if (idx !== -1) {
        conversations.value[idx].lastMessage = {
          id: (chat.id as number) || Date.now(),
          messageId: (chat.messageId as string) || `msg_${Date.now()}`,
          body: (chat.body as string),
          direction: (chat.direction as string) || 'incoming',
          created: (chat.created as string) || new Date().toISOString(),
          byAgent: chat.byAgent as { id: number; name: string; email?: string; role: string } | undefined
        };
        conversations.value[idx].totalMessages = (conversations.value[idx].totalMessages || 0) + 1;

        // Increment unread only for incoming messages and only if the conversation isn't selected
        if (isIncoming && Number(props.selectedConversationId) !== convId) {
          incrementUnreadCount(convId);
          // console.log(`[ChatList] Increment unread untuk conversation ${convId}, count: ${getUnreadCount(convId)}`);
        }
      } else {
        // Add new conversation to list; normalize conversationId to number
        const customer = response.customer as Record<string, unknown>;
        conversations.value.unshift({
          conversationId: convId,
          customerId: (customer?.id as number) || 0,
          customer: (response.customer as { id: number; name: string; phone: string }) || { id: 0, name: '', phone: '' },
          involvedAgents: (response.involvedAgents as Array<{ id: number; name: string; email?: string; role: string }>) || [],
          primaryAgent: (response.primaryAgent as { id: number; name: string; email?: string; role: string }) || { id: 0, name: '', role: '' },
          lastMessage: {
            id: (chat.id as number) || Date.now(),
            messageId: (chat.messageId as string) || `msg_${Date.now()}`,
            body: (chat.body as string),
            direction: (chat.direction as string) || 'incoming',
            created: (chat.created as string) || new Date().toISOString(),
            byAgent: chat.byAgent as { id: number; name: string; email?: string; role: string } | undefined
          },
          totalMessages: 1
        });

        // If incoming and not selected, initialize unread count
        if (isIncoming && Number(props.selectedConversationId) !== convId) {
          incrementUnreadCount(convId);
        }
      }
    }
  });
  onSocket('message_sent', (...args: unknown[]) => {
    const response = args[0] as Record<string, unknown>;
    if (response && response.chat && response.customer) {
      const chat = response.chat as Record<string, unknown>;
      const convId = chat.conversationId;
      if (convId) {
        const idx = conversations.value.findIndex(conv => conv.conversationId === convId);
        if (idx !== -1) {
          conversations.value[idx].lastMessage = {
            id: (chat.id as number) || Date.now(),
            messageId: (chat.messageId as string) || `msg_${Date.now()}`,
            body: (chat.body as string),
            direction: (chat.direction as string) || 'outgoing',
            created: (chat.created as string) || new Date().toISOString(),
            byAgent: chat.byAgent as { id: number; name: string; email?: string; role: string } | undefined
          };
          conversations.value[idx].totalMessages = (conversations.value[idx].totalMessages || 0) + 1;
        } else {
          // Tambahkan percakapan baru ke list jika belum ada, pastikan semua properti Conversation terisi
          const customer = response.customer as Record<string, unknown>;
          conversations.value.unshift({
            conversationId: (convId as number),
            customerId: (customer?.id as number) || 0,
            customer: (response.customer as { id: number; name: string; phone: string }) || { id: 0, name: '', phone: '' },
            involvedAgents: (response.involvedAgents as Array<{ id: number; name: string; email?: string; role: string }>) || [],
            primaryAgent: (response.primaryAgent as { id: number; name: string; email?: string; role: string }) || { id: 0, name: '', role: '' },
            lastMessage: {
              id: (chat.id as number) || Date.now(),
              messageId: (chat.messageId as string) || `msg_${Date.now()}`,
              body: (chat.body as string),
              direction: (chat.direction as string) || 'outgoing',
              created: (chat.created as string) || new Date().toISOString(),
              byAgent: chat.byAgent as { id: number; name: string; email?: string; role: string } | undefined
            },
            totalMessages: 1
          });
        }
      }
    }
  });
});
</script>
