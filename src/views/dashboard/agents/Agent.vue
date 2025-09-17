<template>
    <DashboardLayout>
        <div class="content">
            <!-- BEGIN: Page Title -->
            <h2 class="intro-y text-lg font-medium mt-10">
                Agent Data List
            </h2>
            <!-- END: Page Title -->
            
            <div class="grid grid-cols-12 gap-6 mt-5">
                <!-- BEGIN: Data Controls -->
                <div class="intro-y col-span-12 flex items-center justify-between mt-2">
                    <!-- Kiri: Add & Dropdown -->
                    <div class="flex items-center space-x-2">
                        <button 
                            class="btn btn-primary shadow-md mr-2"
                            @click="openCreateModal"
                        >
                            Add New Agent
                        </button>
                        <div class="dropdown">
                            <button class="dropdown-toggle btn px-2 box" aria-expanded="false" data-tw-toggle="dropdown">
                                <span class="w-5 h-5 flex items-center justify-center">
                                    <i class="w-4 h-4" data-feather="plus"></i>
                                </span>
                            </button>
                            <div class="dropdown-menu w-40">
                                <ul class="dropdown-content">
                                    <li>
                                        <a href="" class="dropdown-item"> 
                                            <i data-feather="printer" class="w-4 h-4 mr-2"></i> Print 
                                        </a>
                                    </li>
                                    <li>
                                        <a href="" class="dropdown-item"> 
                                            <i data-feather="file-text" class="w-4 h-4 mr-2"></i> Export to Excel 
                                        </a>
                                    </li>
                                    <li>
                                        <a href="" class="dropdown-item"> 
                                            <i data-feather="file-text" class="w-4 h-4 mr-2"></i> Export to PDF 
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Kanan: Search -->
                    <div class="w-56 relative text-slate-500">
                        <input 
                            type="text" 
                            class="form-control w-56 box pr-10" 
                            placeholder="Search agents..."
                            v-model="searchQuery"
                        >
                        <i class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-feather="search"></i> 
                    </div>
                </div>
                <!-- END: Data Controls -->


                <!-- BEGIN: Loading State -->
                <div v-if="isLoading" class="intro-y col-span-12 text-center py-10">
                    <div class="text-lg text-slate-500">Loading agents...</div>
                </div>
                <!-- END: Loading State -->

                <!-- BEGIN: Error State -->
                <div v-if="error && !isLoading" class="intro-y col-span-12">
                    <div class="alert alert-danger">
                        <div class="flex items-center">
                            <i data-feather="alert-circle" class="w-6 h-6 mr-2"></i>
                            <div>
                                <strong>Error:</strong> {{ error }}
                            </div>
                        </div>
                    </div>
                </div>
                <!-- END: Error State -->

                <!-- BEGIN: Data List -->
                <div v-if="!isLoading && !error" class="intro-y col-span-12 overflow-auto lg:overflow-visible">
                    <table class="table table-report -mt-2">
                        <thead>
                            <tr>
                                <th class="whitespace-nowrap">Photo</th>
                                <th class="whitespace-nowrap">Agent Name</th>
                                <th class="text-center whitespace-nowrap">Phone</th>
                                <th class="text-center whitespace-nowrap">Email</th>
                                <th class="text-center whitespace-nowrap">Status</th>
                                <th class="text-center whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="agent in paginatedAgents" :key="agent.id" class="intro-x">
                                <td class="w-40">
                                    <div class="flex">
                                        <div class="w-10 h-10 image-fit zoom-in">
                                            <img 
                                                :alt="agent.name" 
                                                class="tooltip rounded-full" 
                                                :src="agent.photo" 
                                                :title="`${agent.name} - ${agent.department}`"
                                            >
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <a href="javascript:;" class="font-medium whitespace-nowrap">{{ agent.name }}</a> 
                                    <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">{{ agent.department }}</div>
                                </td>
                                <td class="text-center">{{ agent.phone }}</td>
                                <td class="text-center">{{ agent.email }}</td>
                                <td class="w-40">
                                    <div 
                                        class="flex items-center justify-center"
                                        :class="agent.status === 'Active' ? 'text-success' : 'text-danger'"
                                    > 
                                        <i data-feather="check-square" class="w-4 h-4 mr-2"></i> 
                                        {{ agent.status }} 
                                    </div>
                                </td>
                                <td class="table-report__action w-56">
                                    <div class="flex justify-center items-center">
                                        <a class="flex items-center mr-3" href="javascript:;" @click="openEditModal(agent)"> 
                                            <i data-feather="edit" class="w-4 h-4 mr-1"></i> Edit 
                                        </a>
                                        <button 
                                            class="flex items-center text-danger bg-transparent border-0 p-0 cursor-pointer" 
                                            @click="deleteAgentDirect(agent)"
                                        > 
                                            <i data-feather="trash-2" class="w-4 h-4 mr-1"></i> Delete 
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- END: Data List -->

                <!-- BEGIN: Pagination -->
                <Pagination
                    v-model:current-page="currentPage"
                    v-model:items-per-page="itemsPerPage"
                    :total-items="totalFilteredItems"
                    @page-change="handlePageChange"
                    @items-per-page-change="handleItemsPerPageChange"
                />
                <!-- END: Pagination -->
            </div>

            <!-- BEGIN: Create Agent Modal -->
            <CreateAgentModal
                v-model:show="showCreateModal"
                :loading="isCreating"
                @submit="handleCreateAgent"
                @close="handleCloseCreateModal"
                ref="createAgentModalRef"
            />
            <!-- END: Create Agent Modal -->

            <!-- BEGIN: Edit Agent Modal -->
            <EditAgentModal
                v-model:show="showEditModal"
                :agent="selectedAgent"
                :loading="isEditing"
                @submit="handleEditAgent"
                @close="handleCloseEditModal"
                ref="editAgentModalRef"
            />
            <!-- END: Edit Agent Modal -->

        </div>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import DashboardLayout from '../../../components/Layout/DashboardLayout.vue';
import Pagination from '../../../components/ui/Pagination.vue';
import { agentService } from '../../../services/agent-service';
import type { Agent as ApiAgent, CreateAgentRequest } from '../../../interfaces/agent.interface';
import CreateAgentModal from '../../../components/agent/CreateAgentModal.vue';
import EditAgentModal from '../../../components/agent/EditAgentModal.vue';
import { useNotification } from '../../../composables/useNotification'

// Display interface for template (maps API data to display format)
interface Agent {
    id: number;
    name: string;
    department: string;
    phone: string;
    email: string;
    photo: string;
    status: 'Active' | 'Inactive';
    joinDate: string;
}

// Reactive data
const searchQuery = ref('');
const agents = ref<Agent[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Create modal data
const showCreateModal = ref(false);
const isCreating = ref(false);
const createAgentModalRef = ref();

// Edit modal state
const showEditModal = ref(false);
const isEditing = ref(false);
const editAgentModalRef = ref();
const selectedAgent = ref<ApiAgent | null>(null);

// Pagination data
const currentPage = ref(1);
const itemsPerPage = ref(5);

const { showSuccessNotification } = useNotification()

// Methods
const loadAgents = async () => {
    try {
        isLoading.value = true;
        error.value = null;
        
        const apiAgents = await agentService.getAgents();
        
        // Transform API data to display format
        agents.value = apiAgents.map((apiAgent: ApiAgent) => ({
            id: apiAgent.id,
            name: agentService.getFullName(apiAgent),
            department: apiAgent.role,
            phone: agentService.getFormattedPhone(apiAgent),
            email: apiAgent.email,
            photo: agentService.getAgentPhotoUrl(apiAgent),
            status: agentService.getAgentStatus(apiAgent),
            joinDate: new Date(apiAgent.created).toLocaleDateString()
        }));
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to load agents';
        console.error('Error loading agents:', err);
    } finally {
        isLoading.value = false;
    }
};

const deleteAgentDirect = async (agent: Agent) => {
    const confirmed = confirm(`Are you sure you want to delete agent "${agent.name}"?\n\nThis action cannot be undone.`);
    if (!confirmed) return;
    try {
        const apiResult = await agentService.deleteAgent(agent.id);
        agents.value = agents.value.filter(a => a.id !== agent.id);
        showSuccessNotification(apiResult?.message || `${agent.name} has been deleted.`);
        console.log('✅ Agent deleted successfully');
    } catch (err) {
        console.error('❌ Delete error:', err);
        agents.value = agents.value.filter(a => a.id !== agent.id);
        error.value = err instanceof Error ? err.message : 'Failed to delete agent';
        setTimeout(() => { error.value = null; }, 3000);
    }
};

const openCreateModal = () => {
    console.log('Opening create modal...'); // Debug log
    showCreateModal.value = true;
};

const handleCreateAgent = async (agentData: CreateAgentRequest) => {
    if (isCreating.value) return;
    try {
        isCreating.value = true;
        const apiResult = await agentService.createAgent(agentData);
        showSuccessNotification(apiResult?.message || 'Agent created successfully!');
        createAgentModalRef.value?.setSuccess('Agent created successfully!');
        await loadAgents();
        setTimeout(() => {
            showCreateModal.value = false;
        }, 1200);
    } catch (err) {
        createAgentModalRef.value?.setError(err instanceof Error ? err.message : 'Failed to create agent');
    } finally {
        isCreating.value = false;
    }
};
const handleCloseCreateModal = () => {
    showCreateModal.value = false;
};

const openEditModal = (agent: Agent) => {
    // Find the full ApiAgent from the original API data (not mapped display)
    const apiAgent = agents.value.find(a => a.id === agent.id);
    if (apiAgent) {
        // You may want to keep the original API agent data for editing
        selectedAgent.value = {
            id: agent.id,
            firstName: agent.name.split(' ')[0], // crude split, adjust as needed
            surname: agent.name.split(' ').slice(1).join(' '),
            email: agent.email,
            phone: agent.phone,
            role: agent.department,
            // Add other fields as needed
        } as ApiAgent;
        showEditModal.value = true;
    }
};

const handleEditAgent = async ({ id, data }: { id: number, data: any }) => {
    if (isEditing.value) return;
    try {
        isEditing.value = true;
        const apiResult = await agentService.updateAgent(id, data);
        showSuccessNotification(apiResult?.message || 'Agent updated successfully!');
        editAgentModalRef.value?.setSuccess('Agent updated successfully!');
        await loadAgents();
        setTimeout(() => {
            showEditModal.value = false;
        }, 1200);
    } catch (err) {
        editAgentModalRef.value?.setError(err instanceof Error ? err.message : 'Failed to update agent');
    } finally {
        isEditing.value = false;
    }
};
const handleCloseEditModal = () => {
    showEditModal.value = false;
};

// Pagination handlers
const handlePageChange = (page: number) => {
    currentPage.value = page;
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleItemsPerPageChange = (newItemsPerPage: number) => {
    itemsPerPage.value = newItemsPerPage;
    currentPage.value = 1; // Reset to first page when changing items per page
};

// Computed properties
const filteredAgents = computed(() => {
    if (!searchQuery.value) {
        return agents.value;
    }
    
    const query = searchQuery.value.toLowerCase();
    return agents.value.filter(agent => 
        agent.name.toLowerCase().includes(query) ||
        agent.department.toLowerCase().includes(query) ||
        agent.email.toLowerCase().includes(query) ||
        agent.phone.includes(query)
    );
});

const paginatedAgents = computed(() => {
    const filtered = filteredAgents.value;
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filtered.slice(start, end);
});

const totalFilteredItems = computed(() => {
    return filteredAgents.value.length;
});


// Watchers
watch(searchQuery, () => {
    // Reset to first page when search query changes
    currentPage.value = 1;
});

// Initialize on mount
onMounted(async () => {
    // Initialize feather icons if available
    if (window.feather) {
        window.feather.replace();
    }
    
    // Load agents from API
    await loadAgents();
});
</script>

<style scoped>
/* Simple styles for agent list */
</style>