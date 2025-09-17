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