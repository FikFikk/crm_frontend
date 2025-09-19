// src/interfaces/display-agent.interface.ts
import type { Agent as ApiAgent } from './agent.interface';

/**
 * DisplayAgent extends ApiAgent with UI-only fields for frontend display
 */
export type DisplayAgent = ApiAgent & {
    name: string;
    department: string;
    photo: string;
    status: 'Active' | 'Inactive';
    joinDate: string;
};
