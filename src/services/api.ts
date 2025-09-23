// src/services/api.ts
import { apiHeaders } from "./api-header";
import { authHeader } from "./auth-header";

// Gunakan VITE_PHP_API_URL dari .env, fallback ke localhost
const baseUrl = import.meta.env.VITE_PHP_API_URL;

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
    options.headers = {
        ...apiHeaders(),
        ...authHeader(),
        ...options.headers
    };
    const response = await fetch(`${baseUrl}${url}`, options);
    return handleResponse(response) as Promise<T>;
}

// Cara pakai:
// Tambahkan di .env (root project):
// VITE_PHP_API_URL=http://localhost:8080/api
// Atur sesuai environment (dev/staging/prod)
