// src/services/auth-service.ts
import { apiFetch } from './api';
import { apiHeaders } from './api-header';
import { authHeader } from './auth-header';

export interface LoginResponse {
    success: boolean;
    message: string;
    user: {
        id: number;
        email: string;
        firstName: string;
        surname: string;
        role: string;
        companyId: number | null;
        companyName: string | null;
    };
    access_token: string;
    expires_at: string;
}

export interface ResetPasswordResponse {
    success: boolean;
    message: string;
}

export interface SetPasswordResponse {
    success: boolean;
    message: string;
}

export interface MeResponse {
    success: boolean;
    user: {
        id: number;
        email: string;
        firstName: string;
        surname: string;
        role: string;
        companyId: number | null;
        companyName: string | null;
    };
}

export interface TokensResponse {
    success: boolean;
    tokens: Array<{
        id: string;
        name: string;
        created_at: string;
        last_used_at?: string;
    }>;
}

export const authService = {
    login,
    logout,
    me,
    tokens,
    resetPassword,
    setPassword,
};
// Request password reset: send code to email
async function resetPassword(email: string): Promise<ResetPasswordResponse> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: { 
            ...apiHeaders() 
        },
        body: JSON.stringify({ email })
    };
    return await apiFetch<ResetPasswordResponse>('/auth/reset-password', requestOptions);
}

// Set new password using reset code
async function setPassword(params: { email: string; code: string; password: string; password_confirmation: string }): Promise<SetPasswordResponse> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: { 
            ...apiHeaders() 
        },
        body: JSON.stringify(params)
    };
    return await apiFetch<SetPasswordResponse>('/auth/set-password', requestOptions);
}

async function login(email: string, password: string, deviceName = "Web App"): Promise<LoginResponse> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: { 
            ...apiHeaders() 
        },
        body: JSON.stringify({ email, password, device_name: deviceName })
    };

    const result: LoginResponse = await apiFetch<LoginResponse>('/auth/login', requestOptions);

    if (result && result.access_token) {
        localStorage.setItem('user', JSON.stringify(result));
    }

    return result;
}

async function logout(): Promise<void> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: { 
            ...authHeader(),
            ...apiHeaders()
        }
    };

    await apiFetch('/auth/logout', requestOptions);
    localStorage.removeItem('user');
}

async function me(): Promise<MeResponse> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: { 
            ...authHeader(),
            ...apiHeaders()
        }
    };

    return await apiFetch<MeResponse>('/auth/me', requestOptions);
}

async function tokens(): Promise<TokensResponse> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: { 
            ...authHeader(),
            ...apiHeaders()
        }
    };

    return await apiFetch<TokensResponse>('/auth/tokens', requestOptions);
}
