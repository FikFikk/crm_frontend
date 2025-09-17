// src/services/auth-header.ts
export function authHeader(): Record<string, string> {
    const user = localStorage.getItem('user');
    if (user) {
        const parsed = JSON.parse(user);
        if (parsed && parsed.access_token) {
            return { Authorization: 'Bearer ' + parsed.access_token };
        }
    }
    return {};
}
