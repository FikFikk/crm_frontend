<template>
    <div class="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
        
        <!-- Pagination Controls -->
        <nav class="w-full sm:w-auto mt-3 sm:mt-0">
            <ul class="pagination">
                <!-- First Page -->
                <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                    <a 
                        class="page-link" 
                        href="#" 
                        @click.prevent="goToPage(1)"
                        :class="{ 'cursor-not-allowed opacity-50': currentPage === 1 }"
                    > 
                        <i class="w-4 h-4" data-feather="chevrons-left"></i> 
                    </a>
                </li>

                <!-- Previous Page -->
                <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                    <a 
                        class="page-link" 
                        href="#" 
                        @click.prevent="goToPage(currentPage - 1)"
                        :class="{ 'cursor-not-allowed opacity-50': currentPage === 1 }"
                    > 
                        <i class="w-4 h-4" data-feather="chevron-left"></i> 
                    </a>
                </li>

                <!-- Page Numbers -->
                <template v-for="page in visiblePages" :key="page">
                    <li v-if="page === '...'" class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>
                    <li v-else class="page-item" :class="{ 'active': page === currentPage }">
                        <a 
                            class="page-link" 
                            href="#" 
                            @click.prevent="goToPage(page)"
                        >
                            {{ page }}
                        </a>
                    </li>
                </template>

                <!-- Next Page -->
                <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
                    <a 
                        class="page-link" 
                        href="#" 
                        @click.prevent="goToPage(currentPage + 1)"
                        :class="{ 'cursor-not-allowed opacity-50': currentPage === totalPages }"
                    > 
                        <i class="w-4 h-4" data-feather="chevron-right"></i> 
                    </a>
                </li>

                <!-- Last Page -->
                <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
                    <a 
                        class="page-link" 
                        href="#" 
                        @click.prevent="goToPage(totalPages)"
                        :class="{ 'cursor-not-allowed opacity-50': currentPage === totalPages }"
                    > 
                        <i class="w-4 h-4" data-feather="chevrons-right"></i> 
                    </a>
                </li>
            </ul>
        </nav>
        
        <!-- Pagination Info -->
        <div class="w-full sm:w-auto sm:mr-auto">
            <div class="text-slate-500 text-sm">
                Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} entries
            </div>
        </div>

        <!-- Per Page Selector -->
        <select 
            class="w-20 form-select box mt-3 sm:mt-0 sm:ml-3" 
            :value="itemsPerPage"
            @change="changeItemsPerPage($event)"
        >
            <option v-for="option in perPageOptions" :key="option" :value="option">
                {{ option }}
            </option>
        </select>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';

// Props
interface Props {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    perPageOptions?: number[];
}

const props = withDefaults(defineProps<Props>(), {
    perPageOptions: () => [5, 10, 25, 50]
});

// Emits
const emit = defineEmits<{
    'update:currentPage': [page: number];
    'update:itemsPerPage': [itemsPerPage: number];
    'pageChange': [page: number];
    'itemsPerPageChange': [itemsPerPage: number];
}>();

// Computed
const totalPages = computed(() => {
    return Math.ceil(props.totalItems / props.itemsPerPage);
});

const startItem = computed(() => {
    if (props.totalItems === 0) return 0;
    return (props.currentPage - 1) * props.itemsPerPage + 1;
});

const endItem = computed(() => {
    const end = props.currentPage * props.itemsPerPage;
    return Math.min(end, props.totalItems);
});

const visiblePages = computed(() => {
    const pages: (number | string)[] = [];
    const total = totalPages.value;
    const current = props.currentPage;

    if (total <= 7) {
        // Show all pages if total is 7 or less
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
    } else {
        // Always show first page
        pages.push(1);

        if (current <= 5) {
            // Show pages 2, 3, 4, 5 and ellipsis
            for (let i = 2; i <= 5; i++) {
                pages.push(i);
            }
            pages.push('...');
        } else if (current >= total - 3) {
            // Show ellipsis and last 4 pages
            pages.push('...');
            for (let i = total - 5; i <= total - 1; i++) {
                pages.push(i);
            }
        } else {
            // Show ellipsis, current-1, current, current+1, ellipsis
            pages.push('...');
            for (let i = current - 1; i <= current + 1; i++) {
                pages.push(i);
            }
            pages.push('...');
        }

        // Always show last page
        if (total > 1) {
            pages.push(total);
        }
    }

    return pages;
});

// Methods
const goToPage = (page: string | number) => {
    const pageNum = typeof page === 'string' ? parseInt(page) : page;
    if (pageNum < 1 || pageNum > totalPages.value || pageNum === props.currentPage) {
        return;
    }
    
    emit('update:currentPage', pageNum);
    emit('pageChange', pageNum);
};

const changeItemsPerPage = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    const newItemsPerPage = parseInt(target.value);
    
    emit('update:itemsPerPage', newItemsPerPage);
    emit('itemsPerPageChange', newItemsPerPage);
    
    // Reset to first page when changing items per page
    emit('update:currentPage', 1);
    emit('pageChange', 1);
};

// Initialize Feather icons on mount
onMounted(() => {
    if (window.feather) {
        window.feather.replace();
    }
});
</script>

<style scoped>
.page-item.disabled .page-link {
    pointer-events: none;
}

.page-item.active .page-link {
    background-color: #064e3be6;
    border-color: #064e3be6;
    color: white;
}

.pagination {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
}

.page-item {
    margin: 0 2px;
}

.page-link {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.375rem 0.75rem;
    text-decoration: none;
    background-color: #fff;
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
    color: #374151;
    transition: all 0.15s ease-in-out;
    min-width: 2.5rem;
    height: 2.5rem;
}

.page-link:hover {
    background-color: #f8fafc;
    border-color: #c5c9d1;
    color: #1f2937;
}
</style>