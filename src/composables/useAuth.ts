import { ref } from 'vue';
import type { UserSession } from '../interfaces';

// Ambil user dari localStorage (atau sesuaikan dengan state management yang dipakai)
const user = ref<UserSession | null>(
	JSON.parse(localStorage.getItem('user') || 'null')
);

export function useAuth() {
	return { user };
}
