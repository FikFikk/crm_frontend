// src/services/api.ts
import { apiHeaders } from "./api-header";
import { authHeader } from "./auth-header";

async function handleResponse(response: Response): Promise<unknown> {
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('user');
            location.reload();
        }
        const error = (data && (data.error || data.message)) || response.statusText;
        return Promise.reject(error);
    }

    return data;
}

export async function apiFetch<T = unknown>(url: string, options: RequestInit = {}): Promise<T> {
    const baseUrl = "http://localhost:8080/api";
    options.headers = {
        ...apiHeaders(),
        ...authHeader(),
        ...options.headers
    };
    const response = await fetch(`${baseUrl}${url}`, options);
    return handleResponse(response) as Promise<T>;
}
