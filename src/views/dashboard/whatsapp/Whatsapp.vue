<template>
    <DashboardLayout>
        <div class="intro-y box rounded-lg shadow mt-10">
            <div class="container" style="padding: 30px;">
                <h2 class="text-xl font-bold mb-4">WhatsApp Connection</h2>
                <div v-if="loading" class="text-center py-6">Loading...</div>
                <div v-else>
                    <div class="mb-4">
                        <div class="font-semibold">Status:</div>
                        <div class="text-lg">
                            <span v-if="isConnected" class="text-green-600 font-bold">Connected</span>
                            <span v-else-if="status === 'connecting'" class="text-yellow-600 font-bold">Connecting</span>
                            <span v-else class="text-red-600 font-bold">Disconnected</span>
                        </div>
                        <div v-if="phoneNumber" class="text-sm text-slate-500">Phone: {{ phoneNumber }}</div>
                        <div v-if="lastSeen" class="text-xs text-slate-400">Last seen: {{ lastSeen }}</div>
                    </div>
                    <div v-if="!isConnected && qrCode" class="mb-4 text-center">
                        <div class="mb-2 font-medium">Scan QR Code to Connect:</div>
                        <img :src="'data:image/png;base64,' + qrCode" alt="QR Code" class="inline-block border p-2 bg-slate-50 rounded" style="max-width:220px;">
                    </div>
                    <div class="flex gap-2 mt-4">
                        <button @click="fetchStatus" class="box px-4 py-2 rounded shadow hover:bg-slate-300">Refresh Status</button>
                        <button v-if="!isConnected" @click="getQr" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Generate QR</button>
                        <button v-if="isConnected" @click="disconnect" class="px-4 py-2 rounded bg-danger text-white hover:bg-slate-300">Disconnect</button>
                        <!-- <button v-if="isConnected" @click="disconnect" class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Disconnect</button> -->
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import DashboardLayout from '../../../components/Layout/DashboardLayout.vue';
import { whatsappService } from '../../../services/whatsapp-service';

const loading = ref(false);
const status = ref('');
const qrCode = ref('');
const phoneNumber = ref('');
const lastSeen = ref('');

// Status yang dianggap sudah connect
const connectedStatuses = ['connected', 'ready', 'authenticated'];
const isConnected = computed(() => connectedStatuses.includes(status.value));

// Ambil companyId dari user di localStorage
function getCompanyId(): number | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const userObj = JSON.parse(userStr);
            return userObj.user?.companyId || userObj.user?.companyID || null;
        } catch {
            return null;
        }
    }
    return null;
}

const companyId = getCompanyId();

async function fetchStatus() {
    if (!companyId) return;
    loading.value = true;
    try {
        const res = await whatsappService.getConnectionStatus(companyId);
        status.value = res.connection_status || 'disconnected';
        phoneNumber.value = res.phone_number || '';
        lastSeen.value = res.last_seen || '';
        if (!isConnected.value) {
            // Try to get QR if not connected
            await getQr();
        } else {
            qrCode.value = '';
        }
    } catch (e) {
        status.value = 'disconnected';
        qrCode.value = '';
    } finally {
        loading.value = false;
    }
}

async function getQr() {
    if (!companyId) return;
    loading.value = true;
    try {
        const res = await whatsappService.getQRCode(companyId);
        qrCode.value = res.qr_code || '';
        status.value = res.status || status.value;
    } catch (e) {
        qrCode.value = '';
    } finally {
        loading.value = false;
    }
}

async function disconnect() {
    if (!companyId) return;
    loading.value = true;
    try {
        await whatsappService.disconnect(companyId);
        await fetchStatus();
    } catch {}
    loading.value = false;
}

onMounted(fetchStatus);
</script>

<style scoped>
/* Add any component-specific styles here */
</style>