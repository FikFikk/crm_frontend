// Interfaces for utils-service

export interface DashboardStats {
  customer_count: number;
  agent_response_times: AgentResponseTime[];
  agent_count: number;
  today_assignments: TodayAssignment[];
  today_chats: number;
  total_assignments: number;
}

export interface AgentResponseTime {
  agent_id: number;
  agent_name: string;
  average_response_time_minutes: number;
  total_interactions: number;
  total_assignments: number;
}

export interface TodayAssignment {
  agent_id: number;
  agent_name: string;
  today_assignment_count: number;
}
