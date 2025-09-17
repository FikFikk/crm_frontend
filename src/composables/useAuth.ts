import { ref } from 'vue';

// Ambil user dari localStorage (atau sesuaikan dengan state management yang dipakai)
const user = ref<any>(
	JSON.parse(localStorage.getItem('user') || 'null')
);

export function useAuth() {
	return { user };
}
