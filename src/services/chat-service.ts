// src/services/chat-service.ts
import { apiFetch } from './api';
import { apiHeaders } from './api-header';
import { authHeader } from './auth-header';

export interface ChatAgent {
  id: number;
  name: string;
  email?: string;
  role: string;
}

export interface ChatCustomer {
  id: number;
  name: string;
  phone: string;
}

export interface LastMessage {
  id: number;
  messageId: string;
  body: string;
  direction: string;
  created: string;
  byAgent?: ChatAgent;
  status?: 'sending' | 'sent' | 'delivered' | 'read'; // Status pesan
}

export interface Conversation {
  conversationId: number;
  customerId: number;
  customer: ChatCustomer;
  involvedAgents: ChatAgent[];
  primaryAgent: ChatAgent;
  lastMessage: LastMessage;
  totalMessages: number;
  messages?: ChatMessage[]; // Tambahan: array pesan terakhir (opsional, untuk ChatList centang)
}

export interface ConversationListResponse {
  conversations: Conversation[];
}

export interface ChatMessage {
  id: number;
  messageId: string;
  body: string;
  direction: string;
  created: string;
  lastEdited?: string;
  agent?: ChatAgent;
  type?: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read'; // Status pesan
  imageURL?: string;
  videoURL?: string;
  audioURL?: string;
  documentURL?: string;
  locationLat?: string;
  locationLong?: string;
}

export interface ConversationDetail {
  conversationId: string;
  customer: ChatCustomer;
  involvedAgents: ChatAgent[];
  totalMessages: number;
  messages: ChatMessage[];
}

export interface ConversationDetailResponse {
  conversation: ConversationDetail;
}

export interface SendMessageRequest {
  conversationId: number;
  message: string;
  messageId: string;
}

export interface SendMessageResponse {
  success: boolean;
  chat: {
    id: number;
    messageId: string;
    body: string;
    direction: string;
    agentId: number;
    customerId: number;
    created: string;
  };
  agent: ChatAgent;
  customer: ChatCustomer;
  agentRole: string;
}

class ChatService {
  /**
   * Add agent to a conversation (assignment)
   * @param customerId - ID customer (conversation)
   * @param agentId - ID agent yang ingin ditambahkan
   */
  async addAgentToConversation(customerId: number, agentId: number): Promise<any> {
    const url = `/chats/${customerId}/add-agent`;
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        ...authHeader(),
        ...apiHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ agentId }),
    };
    return apiFetch(url, requestOptions);
  }

  /**
   * Remove agent from a conversation (assignment)
   * @param customerId - ID customer (conversation)
   * @param agentId - ID agent yang ingin dihapus
   */
  async removeAgentFromConversation(customerId: number, agentId: number): Promise<any> {
    const url = `/chats/${customerId}/remove-agent`;
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        ...authHeader(),
        ...apiHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ agentId }),
    };
    return apiFetch(url, requestOptions);
  }
  async getConversations(params: { agentId?: number; customerId?: number } = {}): Promise<Conversation[]> {
    try {
      let url = '/chats';
      const searchParams = new URLSearchParams();
      if (params.agentId) searchParams.append('agentId', params.agentId.toString());
      if (params.customerId) searchParams.append('customerId', params.customerId.toString());
      if ([...searchParams].length > 0) {
        url += `?${searchParams.toString()}`;
      }
      const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
          ...authHeader(),
          ...apiHeaders()
        }
      };
      const result: ConversationListResponse = await apiFetch(url, requestOptions);
      return result.conversations || [];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      
      // Handle specific error when agent has no associated chats
      if (typeof error === 'string' && (
        error.includes('Cannot filter') && error.includes('empty set') ||
        error.includes('CustomerID') && error.includes('empty set')
      )) {
        console.log('Agent has no associated conversations');
        return [];
      }
      
      // Handle Error objects
      if (error instanceof Error && (
        error.message.includes('Cannot filter') && error.message.includes('empty set') ||
        error.message.includes('CustomerID') && error.message.includes('empty set') ||
        error.message.includes('500')
      )) {
        console.log('No conversations found for this agent');
        return [];
      }
      
      throw error;
    }
  }

  async getDetailChat(conversationId: string | number): Promise<ConversationDetailResponse> {
    try {
      const url = `/chats/${conversationId}/detail`;
      console.log('[chatService] Fetching detail chat:', url);
      const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
          ...authHeader(),
          ...apiHeaders()
        }
      };
      const result = await apiFetch(url, requestOptions);
      console.log('[chatService] Detail chat result:', result);
      return result;
    } catch (error) {
      console.error('Error fetching detail chat:', error);
      throw error;
    }
  }

  async sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      const url = '/chats';
      console.log('[chatService] Sending message:', data);
      const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
          ...authHeader(),
          ...apiHeaders()
        },
        body: JSON.stringify(data)
      };
      const result = await apiFetch(url, requestOptions);
      console.log('[chatService] Send message result:', result);
      return result;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
