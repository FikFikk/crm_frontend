// src/interfaces/index.ts

// Agent interfaces
export type {
    Agent,
    CreateAgentRequest,
    CreateAgentResponse,
    DeleteAgentResponse,
    AgentListResponse
} from './agent.interface';

// API interfaces
export type {
    ApiResponse,
    ApiError,
    PaginationMeta,
    PaginatedResponse,
    SearchFilter
} from './api.interface';

// Socket event interfaces
export interface SocketResponse<T = Record<string, unknown>> {
    success: boolean;
    message?: string;
    data?: T;
}

export interface MessageReceivedData {
    id: string;
    conversation_id: string;
    sender: string;
    message: string;
    timestamp: string;
    message_type?: string;
    media_url?: string;
}

export interface MessageSentData {
    id: string;
    conversation_id: string;
    message: string;
    timestamp: string;
    status: string;
}

export interface MessageStatusData {
    message_id: string;
    status: 'delivered' | 'read';
    timestamp: string;
}

export interface SocketMessageReceivedEvent {
    chat: {
        body: string;
        type: string;
        conversationId: number;
    };
    customer: {
        name: string;
    };
}

// Dashboard interfaces
export interface AgentResponseTime {
    agent_name: string;
    average_response_time_minutes: number;
}

export interface DashboardStats {
    total_conversations: number;
    total_messages: number;
    pending_conversations: number;
    agent_response_times: AgentResponseTime[];
    average_response_time: number;
}

// Company interfaces
export interface Company {
    id?: number;
    name?: string;
    code?: string;
    email?: string;
    phone?: string;
    address?: string;
    created?: string;
    lastEdited?: string;
}

export interface CompanyUpdateData {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
}

// Chat interfaces
export interface Message {
    id: string;
    conversation_id: string;
    sender: string;
    message: string;
    timestamp: string;
    message_type?: string;
    media_url?: string;
    status?: string;
}

export interface Conversation {
    id: string;
    customer_phone: string;
    customer_name: string;
    agent_id?: string;
    agent_name?: string;
    status: string;
    created_at: string;
    updated_at: string;
    lastMessage?: Message;
}

// User interfaces
export interface User {
    id: number;
    firstName: string;
    surname?: string;
    email: string;
    role: string;
    company_id?: number;
    companyId?: number;
    companyName?: string;
}

export interface UserSession {
    user: User;
    token: string;
    company_id?: number;
    companyId?: number;
    companyName?: string;
}

// WhatsApp interfaces
export interface WhatsAppConnectionStatus {
    connected: boolean;
    qr_code?: string;
    status: string;
}

export interface WhatsAppQRResponse {
    qr_code: string;
    status: string;
}

// Window interface extensions for global objects
declare global {
    interface Window {
        socket?: {
            emit: (event: string, data: unknown) => void;
            on: (event: string, callback: (data: unknown) => void) => void;
            off: (event: string, callback?: (data: unknown) => void) => void;
        };
        feather?: {
            replace: () => void;
        };
        app?: {
            dropdowns?: {
                init: () => void;
            };
        };
    }
}