// Interfaces for utils-service


export interface StatWithGrowth {
  value: number;
  percent_change: number;
  message: string;
}

export interface DashboardStats {
  customer_count: StatWithGrowth;
  agent_count: StatWithGrowth;
  total_assignments: StatWithGrowth;
  today_chats: StatWithGrowth;
  agent_response_times: AgentResponseTime[];
  today_assignments: TodayAssignment[];
  latest_chats: LatestChat[];
  recent_activities: RecentActivity[];
}

export interface LatestChat {
  id: number;
  customer_id: number;
  customer_name: string;
  message: string | null;
  created: string;
  agent_id: number;
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

export interface RecentActivity {
  id: number;
  title: string;
  description: string;
  created: string;
}
