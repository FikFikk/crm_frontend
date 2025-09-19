// Import statements
import { apiFetch } from './api';
import { apiHeaders } from './api-header';
import { authHeader } from './auth-header';

import type { DashboardStats, AgentResponseTime, TodayAssignment, LatestChat } from '../interfaces/utils.interface';

// Service functions
export const utilsService = {
       async getDashboardStats() {
	       const res = await apiFetch('/utils/dashboard-stats', {
		       method: 'GET',
		       headers: {
			       ...apiHeaders(),
			       ...authHeader(),
		       },
	       });
	       // Return the full data object, which now includes latest_chats
	       return res.data as DashboardStats;
       },

       async getLatestChats(limit = 5) {
	       const res = await apiFetch(`/utils/latest-chats?limit=${limit}`, {
		       method: 'GET',
		       headers: {
			       ...apiHeaders(),
			       ...authHeader(),
		       },
	       });
	       return res.latest_chats as LatestChat[];
       },

	async getCustomerCount() {
		const res = await apiFetch('/utils/customer-count', {
			method: 'GET',
					headers: {
						...apiHeaders(),
						...authHeader(),
					},
		});
		return res.customer_count as number;
	},

	async getAgentResponseTimes() {
		const res = await apiFetch('/utils/agent-response-times', {
			method: 'GET',
					headers: {
						...apiHeaders(),
						...authHeader(),
					},
		});
		return res.agent_response_times as AgentResponseTime[];
	},

	async getAgentCount() {
		const res = await apiFetch('/utils/agent-count', {
			method: 'GET',
			headers: {
				...apiHeaders(),
				...authHeader(),
			},
		});
		return res.agent_count as number;
	},

	async getTodayAssignments() {
		const res = await apiFetch('/utils/today-assignments', {
			method: 'GET',
			headers: {
				...apiHeaders(),
				...authHeader(),
			},
		});
		return res.today_assignments as TodayAssignment[];
	},

	async getTodayChats() {
		const res = await apiFetch('/utils/today-chats', {
			method: 'GET',
			headers: {
				...apiHeaders(),
				...authHeader(),
			},
		});
		return res.today_chats as number;
	},

	async getTotalAssignments() {
		const res = await apiFetch('/utils/total-assignments', {
			method: 'GET',
			headers: {
				...apiHeaders(),
				...authHeader(),
			},
		});
		return res.total_assignments as number;
	},
};
