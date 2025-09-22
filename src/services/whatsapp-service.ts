// src/services/whatsapp-service.ts
import { apiFetch } from './api';
import { apiHeaders } from './api-header';
import { authHeader } from './auth-header';

export interface WhatsAppSendRequest {
  phone: string;
  message: string;
  api_key: string;
  type?: 'text' | 'image' | 'video' | 'audio' | 'document';
  media?: string; // base64 for media
}

export interface WhatsAppSendResponse {
  success: boolean;
  message_id?: string;
  phone: string;
  status: string;
  message: string;
}

export interface QRCodeRequest {
  id: number; // company ID
}

export interface QRCodeResponse {
  success: boolean;
  company_id: number;
  company_name: string;
  qr_code: string; // base64
  status: string;
  message: string;
}

export interface ConnectionStatusResponse {
  success: boolean;
  company_id: number;
  connection_status: string;
  last_seen?: string;
  phone_number?: string;
}

class WhatsAppService {
  /**
   * Send WhatsApp message
   */
  async sendMessage(data: WhatsAppSendRequest): Promise<WhatsAppSendResponse> {
    try {
      const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
          ...authHeader(),
          ...apiHeaders()
        },
        body: JSON.stringify(data)
      };
      
      const result = await apiFetch<WhatsAppSendResponse>('/wa/send', requestOptions);
      return result;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  /**
   * Get QR code for WhatsApp connection
   */
  async getQRCode(companyId: number): Promise<QRCodeResponse> {
    try {
      const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
          ...authHeader(),
          ...apiHeaders()
        }
      };
      
      const result = await apiFetch<QRCodeResponse>(`/wa/get-qr?id=${companyId}`, requestOptions);
      return result;
    } catch (error) {
      console.error('Error getting QR code:', error);
      throw error;
    }
  }

  /**
   * Get connection status
   */
  async getConnectionStatus(companyId: number): Promise<ConnectionStatusResponse> {
    try {
      const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
          ...authHeader(),
          ...apiHeaders()
        }
      };
      
      const result = await apiFetch<ConnectionStatusResponse>(`/wa/status/${companyId}`, requestOptions);
      return result;
    } catch (error) {
      console.error('Error getting connection status:', error);
      throw error;
    }
  }

  /**
   * Disconnect WhatsApp session
   */
  async disconnect(companyId: number): Promise<{ success: boolean; message: string }> {
    try {
      const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
          ...authHeader(),
          ...apiHeaders()
        }
      };
      
      const result = await apiFetch<{ success: boolean; message: string }>(`/wa/disconnect/${companyId}`, requestOptions);
      return result;
    } catch (error) {
      console.error('Error disconnecting WhatsApp:', error);
      throw error;
    }
  }

  /**
   * Test WhatsApp service connection
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
          ...authHeader(),
          ...apiHeaders()
        }
      };
      
      const result = await apiFetch<{ success: boolean; message: string }>('/wa/test', requestOptions);
      return result;
    } catch (error) {
      console.error('Error testing WhatsApp connection:', error);
      throw error;
    }
  }
}

export const whatsappService = new WhatsAppService();