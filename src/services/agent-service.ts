// src/services/agent-service.ts
import { apiFetch } from './api';
import { apiHeaders } from './api-header';
import { authHeader } from './auth-header';
import type {
    Agent,
    AgentListResponse,
    CreateAgentRequest,
    CreateAgentResponse,
    UpdateAgentRequest,
    UpdateAgentResponse,
    DeleteAgentResponse
} from '../interfaces/agent.interface';

// Re-export interfaces for backward compatibility
export type { 
    Agent, 
    CreateAgentRequest, 
    CreateAgentResponse, 
    UpdateAgentRequest,
    UpdateAgentResponse,
    DeleteAgentResponse, 
    AgentListResponse 
} from '../interfaces/agent.interface';

class AgentService {
    /**
     * Get all agents
     */
    async getAgents(): Promise<Agent[]> {
        try {
            const requestOptions: RequestInit = {
                method: 'GET',
                headers: {
                    ...authHeader(),
                    ...apiHeaders()
                }
            };

            const result: AgentListResponse = await apiFetch('/agents', requestOptions);
            return result.data;
        } catch (error) {
            console.error('Error fetching agents:', error);
            throw error;
        }
    }

    /**
     * Create a new agent
     */
    async createAgent(agentData: CreateAgentRequest): Promise<CreateAgentResponse> {
        try {
            const requestOptions: RequestInit = {
                method: 'POST',
                headers: {
                    ...authHeader(),
                    ...apiHeaders()
                },
                body: JSON.stringify(agentData)
            };

            const result: CreateAgentResponse = await apiFetch('/agents', requestOptions);
            return result;
        } catch (error) {
            console.error('Error creating agent:', error);
            throw error;
        }
    }

    /**
     * Update an existing agent
     */
    async updateAgent(agentId: number, agentData: UpdateAgentRequest): Promise<UpdateAgentResponse> {
        try {
            const requestOptions: RequestInit = {
                method: 'PUT',
                headers: {
                    ...authHeader(),
                    ...apiHeaders()
                },
                body: JSON.stringify(agentData)
            };

            const result: UpdateAgentResponse = await apiFetch(`/agents/${agentId}`, requestOptions);
            return result;
        } catch (error) {
            console.error('Error updating agent:', error);
            throw error;
        }
    }

    /**
     * Delete an agent
     */
    async deleteAgent(agentId: number): Promise<DeleteAgentResponse> {
        try {
            const requestOptions: RequestInit = {
                method: 'DELETE',
                headers: {
                    ...authHeader(),
                    ...apiHeaders()
                }
            };

            const result: DeleteAgentResponse = await apiFetch(`/agents/${agentId}`, requestOptions);
            return result;
        } catch (error) {
            console.error('Error deleting agent:', error);
            throw error;
        }
    }

    /**
     * Search agents by query
     */
    searchAgents(agents: Agent[], query: string): Agent[] {
        if (!query) return agents;
        
        const searchQuery = query.toLowerCase();
        return agents.filter(agent => 
            agent.firstName.toLowerCase().includes(searchQuery) ||
            (agent.surname && agent.surname.toLowerCase().includes(searchQuery)) ||
            agent.email.toLowerCase().includes(searchQuery) ||
            // agent.companyName.toLowerCase().includes(searchQuery) ||
            agent.role.toLowerCase().includes(searchQuery)
        );
    }

    /**
     * Get full name for display
     */
    getFullName(agent: Agent): string {
        return agent.surname ? `${agent.firstName} ${agent.surname}` : agent.firstName;
    }

    /**
     * Get default photo URL (placeholder for now)
     */
    getAgentPhotoUrl(agent: Agent): string {
        // For now, return placeholder images from the assets based on agent ID
        const photoIndex = (agent.id % 15) + 1;
        return `/assets/dist/images/profile-${photoIndex}.jpg`;
    }

    /**
     * Format agent status for display
     */
    getAgentStatus(_agent: Agent): 'Active' | 'Inactive' {
        // For now, assume all agents are active
        // This can be enhanced later based on additional API fields
        return 'Active';
    }

    /**
     * Format phone number for display
     */
    getFormattedPhone(agent: Agent): string {
        return agent.phone || '-';
    }
}

// Export singleton instance
export const agentService = new AgentService();