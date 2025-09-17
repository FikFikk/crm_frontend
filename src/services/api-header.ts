//src/services/api-header.ts
const API_KEY = "crm_e54c761e1dec987a98a0fdb593ff95dbd2fe5813";

export function apiHeaders(): Record<string, string> {
    return {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
    };
}
