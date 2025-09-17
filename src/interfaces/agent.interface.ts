// src/interfaces/agent.interface.ts

/**
 * Agent entity interface
 */
export interface Agent {
    id: number;
    firstName: string;
    surname: string | null;
    email: string;
    companyId: number;
    phone: string | null;
    companyName: string;
    role: string;
    created: string;
}

/**
 * Request interface for creating a new agent
 */
export interface CreateAgentRequest {
    firstName: string;
    surname?: string;
    email: string;
    password: string;
    role?: string;
    companyId?: number;
}

/**
 * Response interface for agent creation
 */
export interface CreateAgentResponse {
    success: boolean;
    message: string;
    data: {
        id: number;
        firstName: string;
        surname: string;
        email: string;
        companyId: number;
        role: string;
    };
}

export interface UpdateAgentRequest {
    firstName?: string;
    surname?: string;
    email?: string;
    phone?: string;
    address?: string;
    password?: string;
    companyId?: number;
    role?: string;
}

export interface UpdateAgentResponse {
    success: boolean;
    message: string;
    data: {
        id: number;
        firstName: string;
        surname?: string;
        email: string;
        phone?: string;
        address?: string;
        companyId?: number;
        companyName?: string;
        role: string;
    };
}

/**
 * Response interface for agent deletion
 */
export interface DeleteAgentResponse {
    success: boolean;
    message: string;
}

/**
 * Response interface for agent list API
 */
export interface AgentListResponse {
    data: Agent[];
}