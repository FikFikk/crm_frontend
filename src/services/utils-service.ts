import { apiFetch } from './api';

// Standard API Response interface
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Types for dashboard statistics
export interface DashboardStats {
  totalConversations: number;
  activeConversations: number;
  totalMessages: number;
  totalCustomers: number;
  pendingChats: number;
  resolvedChats: number;
}

// Types for chart data
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ConversationChartData {
  daily: ChartDataPoint[];
  weekly: ChartDataPoint[];
  monthly: ChartDataPoint[];
}

export interface MessageChartData {
  incoming: ChartDataPoint[];
  outgoing: ChartDataPoint[];
  hourly: ChartDataPoint[];
}

// Types for site configuration
export interface SiteConfig {
  siteName: string;
  companyName: string;
  logo?: string;
  favicon?: string;
  primaryColor?: string;
  secondaryColor?: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  language: string;
  maxFileUploadSize: number;
  allowedFileTypes: string[];
  whatsappSettings: {
    autoReply: boolean;
    businessHours: {
      enabled: boolean;
      start: string;
      end: string;
      timezone: string;
    };
    welcomeMessage?: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
  };
}

// Main Utils Service Class
export class UtilsService {
  
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response: ApiResponse<DashboardStats> = await apiFetch('/utils/dashboard-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default values if API fails
      return {
        totalConversations: 0,
        activeConversations: 0,
        totalMessages: 0,
        totalCustomers: 0,
        pendingChats: 0,
        resolvedChats: 0
      };
    }
  }

  /**
   * Get conversation analytics for charts
   */
  async getConversationAnalytics(period: 'daily' | 'weekly' | 'monthly' = 'daily', days: number = 7): Promise<ConversationChartData> {
    try {
      const url = `/utils/conversation-analytics?period=${period}&days=${days}`;
      const response: ApiResponse<ConversationChartData> = await apiFetch(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation analytics:', error);
      return {
        daily: [],
        weekly: [],
        monthly: []
      };
    }
  }

  /**
   * Get message analytics for charts
   */
  async getMessageAnalytics(period: 'daily' | 'weekly' | 'monthly' = 'daily', days: number = 7): Promise<MessageChartData> {
    try {
      const url = `/utils/message-analytics?period=${period}&days=${days}`;
      const response: ApiResponse<MessageChartData> = await apiFetch(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching message analytics:', error);
      return {
        incoming: [],
        outgoing: [],
        hourly: []
      };
    }
  }

  /**
   * Get agent performance data
   */
  async getAgentPerformance(agentId?: number, period: 'daily' | 'weekly' | 'monthly' = 'weekly') {
    try {
      const url = `/utils/agent-performance?${agentId ? `agentId=${agentId}&` : ''}period=${period}`;
      const response: ApiResponse<any> = await apiFetch(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching agent performance:', error);
      return [];
    }
  }

  /**
   * Get customer activity data
   */
  async getCustomerActivity(customerId?: number, days: number = 30) {
    try {
      const url = `/utils/customer-activity?${customerId ? `customerId=${customerId}&` : ''}days=${days}`;
      const response: ApiResponse<any> = await apiFetch(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer activity:', error);
      return [];
    }
  }

  /**
   * Get site configuration
   */
  async getSiteConfig(): Promise<SiteConfig> {
    try {
      const response: ApiResponse<SiteConfig> = await apiFetch('/utils/site-config');
      return response.data;
    } catch (error) {
      console.error('Error fetching site config:', error);
      // Return default configuration if API fails
      return {
        siteName: 'CRM System',
        companyName: 'Your Company',
        timezone: 'Asia/Jakarta',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        currency: 'IDR',
        language: 'id',
        maxFileUploadSize: 10485760, // 10MB
        allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
        whatsappSettings: {
          autoReply: false,
          businessHours: {
            enabled: false,
            start: '09:00',
            end: '17:00',
            timezone: 'Asia/Jakarta'
          }
        },
        notifications: {
          email: true,
          push: true,
          sound: true
        }
      };
    }
  }

  /**
   * Update site configuration
   */
  async updateSiteConfig(config: Partial<SiteConfig>): Promise<SiteConfig> {
    try {
      const response: ApiResponse<SiteConfig> = await apiFetch('/utils/site-config', {
        method: 'PUT',
        body: JSON.stringify(config),
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating site config:', error);
      throw error;
    }
  }

  /**
   * Get system health status
   */
  async getSystemHealth() {
    try {
      const response: ApiResponse<any> = await apiFetch('/utils/system-health');
      return response.data;
    } catch (error) {
      console.error('Error fetching system health:', error);
      return {
        database: false,
        whatsapp: false,
        storage: false,
        memory: 0,
        cpu: 0
      };
    }
  }

  /**
   * Export data to various formats
   */
  async exportData(type: 'conversations' | 'messages' | 'customers' | 'agents', format: 'csv' | 'xlsx' | 'pdf' = 'csv', filters?: any) {
    try {
      const params = new URLSearchParams({ type, format, ...filters });
      const response = await fetch(`http://localhost:8080/api/utils/export-data?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      return await response.blob();
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  /**
   * Get activity logs
   */
  async getActivityLogs(limit: number = 50, page: number = 1, filters?: any) {
    try {
      const params = new URLSearchParams({ 
        limit: limit.toString(), 
        page: page.toString(), 
        ...filters 
      });
      const response: ApiResponse<any> = await apiFetch(`/utils/activity-logs?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      return [];
    }
  }

  /**
   * Generate reports
   */
  async generateReport(reportType: 'daily' | 'weekly' | 'monthly' | 'custom', startDate?: string, endDate?: string) {
    try {
      const response: ApiResponse<any> = await apiFetch('/utils/generate-report', {
        method: 'POST',
        body: JSON.stringify({ reportType, startDate, endDate }),
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  /**
   * Get notification settings
   */
  async getNotificationSettings() {
    try {
      const response: ApiResponse<any> = await apiFetch('/utils/notification-settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      return {};
    }
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(settings: any) {
    try {
      const response: ApiResponse<any> = await apiFetch('/utils/notification-settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  }

  /**
   * Clear cache
   */
  async clearCache(cacheType?: 'all' | 'conversations' | 'messages' | 'config') {
    try {
      const response: ApiResponse<any> = await apiFetch('/utils/clear-cache', {
        method: 'POST',
        body: JSON.stringify({ type: cacheType || 'all' }),
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw error;
    }
  }

  /**
   * Get app version and build info
   */
  async getAppInfo() {
    try {
      const response: ApiResponse<any> = await apiFetch('/utils/app-info');
      return response.data;
    } catch (error) {
      console.error('Error fetching app info:', error);
      return {
        version: '1.0.0',
        build: 'unknown',
        environment: 'production'
      };
    }
  }
}

// Export singleton instance
export const utilsService = new UtilsService();