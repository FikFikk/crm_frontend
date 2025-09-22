<template>
  <DashboardLayout>
    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-12 2xl:col-span-9">
        <div class="grid grid-cols-12 gap-6">
          <!-- BEGIN: General Report -->
          <div class="col-span-12 mt-8">
            <div class="intro-y flex items-center h-10">
              <h2 class="text-lg font-medium truncate mr-5">
                General Report
              </h2>
              <a href="" class="ml-auto flex items-center " @click.prevent="refreshData">
                <i data-feather="refresh-ccw" class="w-4 h-4 mr-3"></i> Reload Data
              </a>
            </div>
            <div class="grid grid-cols-12 gap-6 mt-5">
              <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div class="report-box zoom-in">
                  <div class="box p-5">
                    <div class="flex">
                      <i data-feather="users" class="report-box__icon text-primary"></i>
                      <div class="ml-auto">
                        <div class="report-box__indicator tooltip cursor-pointer"
                          :class="(dashboardStats?.customer_count?.percent_change ?? 0) < 0 ? 'bg-danger' : 'bg-success'"
                          :title="dashboardStats?.customer_count?.message ?? ''">
                          {{ dashboardStats?.customer_count?.percent_change ?? '-' }}% 
                          <!-- <i :data-feather="dashboardStats?.customer_count?.percent_change < 0 ? 'chevron-down' : 'chevron-up'" class="w-4 h-4 ml-0.5"></i> -->
                        </div>
                      </div>
                    </div>
                    <div class="text-3xl font-medium leading-8 mt-6">{{ dashboardStats?.customer_count?.value ?? '-' }}</div>
                    <div class="text-base text-slate-500 mt-1">Total Customer</div>
                  </div>
                </div>
              </div>
              <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div class="report-box zoom-in">
                  <div class="box p-5">
                    <div class="flex">
                      <i data-feather="user" class="report-box__icon text-pending"></i>
                      <div class="ml-auto">
                        <div class="report-box__indicator tooltip cursor-pointer"
                          :class="(dashboardStats?.agent_count?.percent_change ?? 0) < 0 ? 'bg-danger' : 'bg-success'"
                          :title="dashboardStats?.agent_count?.message ?? ''">
                          {{ dashboardStats?.agent_count?.percent_change ?? '-' }}% 
                          <!-- <i :data-feather="dashboardStats?.agent_count?.percent_change < 0 ? 'chevron-down' : 'chevron-up'" class="w-4 h-4 ml-0.5"></i> -->
                        </div>
                      </div>
                    </div>
                    <div class="text-3xl font-medium leading-8 mt-6">{{ dashboardStats?.agent_count?.value ?? '-' }}</div>
                    <div class="text-base text-slate-500 mt-1">Total Agent</div>
                  </div>
                </div>
              </div>
              <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div class="report-box zoom-in">
                  <div class="box p-5">
                    <div class="flex">
                      <i data-feather="message-square" class="report-box__icon text-warning"></i>
                      <div class="ml-auto">
                        <div class="report-box__indicator tooltip cursor-pointer"
                          :class="(dashboardStats?.today_chats?.percent_change ?? 0) < 0 ? 'bg-danger' : 'bg-success'"
                          :title="dashboardStats?.today_chats?.message ?? ''">
                          {{ dashboardStats?.today_chats?.percent_change ?? '-' }}% 
                          <!-- <i :data-feather="dashboardStats?.today_chats?.percent_change < 0 ? 'chevron-down' : 'chevron-up'" class="w-4 h-4 ml-0.5"></i> -->
                        </div>
                      </div>
                    </div>
                    <div class="text-3xl font-medium leading-8 mt-6">{{ dashboardStats?.today_chats?.value ?? '-' }}</div>
                    <div class="text-base text-slate-500 mt-1">Today's Chats</div>
                  </div>
                </div>
              </div>
              <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div class="report-box zoom-in">
                  <div class="box p-5">
                    <div class="flex">
                      <i data-feather="user-check" class="report-box__icon text-success"></i>
                      <div class="ml-auto">
                        <div class="report-box__indicator tooltip cursor-pointer"
                          :class="(dashboardStats?.total_assignments?.percent_change ?? 0) < 0 ? 'bg-danger' : 'bg-success'"
                          :title="dashboardStats?.total_assignments?.message ?? ''">
                          {{ dashboardStats?.total_assignments?.percent_change ?? '-' }}% 
                          <!-- <i :data-feather="dashboardStats?.total_assignments?.percent_change < 0 ? 'chevron-down' : 'chevron-up'" class="w-4 h-4 ml-0.5"></i> -->
                        </div>
                      </div>
                    </div>
                    <div class="text-3xl font-medium leading-8 mt-6">{{ dashboardStats?.total_assignments?.value ?? '-' }}</div>
                    <div class="text-base text-slate-500 mt-1">Total Assignments</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- END: General Report -->
          
          <div class="col-span-12 lg:col-span-6 mt-8">
            <div class="intro-y">
              <div class="box p-5">
                <div class="flex items-center justify-between mb-5">
                  <h3 class="text-lg font-medium">Agent Response Times</h3>
                </div>
                <div class="text-slate-600 dark:text-slate-300 text-sm mb-4">
                  Average response time by agent (in minutes)
                </div>
                <div style="height: 300px;">
                  <BarChart :data="chartData" :height="300" />
                </div>
              </div>
            </div>
          </div>

          <!-- BEGIN: Weekly Top Products -->
          <div class="col-span-12 lg:col-span-6 mt-6">
            <div class="intro-y block sm:flex items-center h-10">
              <h2 class="text-lg font-medium truncate ml-5">
                Today's Assignments
              </h2>
              <div class="flex items-center sm:ml-auto mt-3 sm:mt-0">
                <!-- <button class="btn box flex items-center text-slate-600 dark:text-slate-300">
                  <i data-feather="file-text" class="hidden sm:block w-4 h-4 mr-2"></i> Export to Excel
                </button> -->
                <!-- <button class="ml-3 btn box flex items-center text-slate-600 dark:text-slate-300">
                  <i data-feather="file-text" class="hidden sm:block w-4 h-4 mr-2"></i> Export to PDF
                </button> -->
              </div>
            </div>
            <div class="intro-y overflow-auto lg:overflow-visible mt-8 sm:mt-0">
              <table class="table table-report sm:mt-2">
                <thead>
                  <tr>
                    <th class="whitespace-nowrap">Name</th>
                    <th class="text-center whitespace-nowrap">Assigned</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="intro-x box shadow" v-for="assign in dashboardStats?.today_assignments || []" :key="assign.agent_id">
                    <td>
                      <a href="" class="font-medium whitespace-nowrap">{{ assign.agent_name }}</a>
                    </td>
                    <td class="text-center">{{ assign.today_assignment_count }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- <div class="intro-y flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-3">
              <nav class="w-full sm:w-auto sm:mr-auto">
                <ul class="pagination">
                  <li class="page-item">
                    <a class="page-link" href="#"> <i class="w-4 h-4" data-feather="chevrons-left"></i> </a>
                  </li>
                  <li class="page-item">
                    <a class="page-link" href="#"> <i class="w-4 h-4" data-feather="chevron-left"></i> </a>
                  </li>
                  <li class="page-item"> <a class="page-link" href="#">...</a> </li>
                  <li class="page-item"> <a class="page-link" href="#">1</a> </li>
                  <li class="page-item active"> <a class="page-link" href="#">2</a> </li>
                  <li class="page-item"> <a class="page-link" href="#">3</a> </li>
                  <li class="page-item"> <a class="page-link" href="#">...</a> </li>
                  <li class="page-item">
                    <a class="page-link" href="#"> <i class="w-4 h-4" data-feather="chevron-right"></i> </a>
                  </li>
                  <li class="page-item">
                    <a class="page-link" href="#"> <i class="w-4 h-4" data-feather="chevrons-right"></i> </a>
                  </li>
                </ul>
              </nav>
              <select class="w-20 form-select box mt-3 sm:mt-0">
                <option>10</option>
                <option>25</option>
                <option>35</option>
                <option>50</option>
              </select>
            </div> -->
          </div>
          <!-- END: Weekly Top Products -->
        </div>
      </div>
      
      <div class="col-span-12 2xl:col-span-3">
        <div class="2xl:border-l -mb-10 pb-10">
          <div class="2xl:pl-6 grid grid-cols-12 gap-6">
            <!-- BEGIN: Transactions -->
            <div class="col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-12 mt-3 2xl:mt-8">
              <div class="intro-x flex items-center h-10">
                <h2 class="text-lg font-medium truncate mr-5">
                  Latest Chats
                </h2>
                <a href="/chat" class="ml-auto truncate">Show More</a>
              </div>
              <div class="mt-5">
                <div class="intro-x" v-for="chat in dashboardStats?.latest_chats || []" :key="chat.id">
                  <div class="box px-5 py-3 mb-3 flex items-center zoom-in">
                    <!-- UI avatar: two initials from customer_name, fallback to customer_id -->
                    <div class="w-10 h-10 flex-none rounded-full bg-primary/10 flex items-center justify-center font-bold text-lg">
                      {{ getAvatarInitials(chat.customer_name, chat.customer_id) }}
                    </div>
                    <div class="ml-4 mr-auto">
                      <div class="font-medium">{{ chat.customer_name && chat.customer_name.trim() !== '' ? chat.customer_name : '-' }}</div>
                      <div class="flex items-center">
                        <div class="text-slate-500 text-xs mt-0.5">
                          {{ chat.message && chat.message.length > 15 ? chat.message.slice(0, 15) + '...' : (chat.message || '-') }}
                        </div>
                      </div>
                    </div>
                    <div class="text-slate-500 text-xs ml-2">
                      {{ formatDateIndo(chat.created) }}
                    </div>
                  </div>
                </div>
                <!-- <a href="/chat" class="intro-x w-full block text-center rounded-md py-3 border border-dotted border-slate-400 dark:border-darkmode-300 text-slate-500">View More</a> -->
              </div>
            </div>
            <!-- END: Transactions -->
            
            <!-- BEGIN: Recent Activities -->
            <div class="col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-12">
              <div class="intro-x flex items-center h-10">
                <h2 class="text-lg font-medium truncate mr-5">
                  Recent Activities
                </h2>
                <a href="/agents" class="ml-auto truncate">Show More</a>
              </div>
              <div class="mt-5 relative before:block before:absolute before:w-px before:h-[85%] before:bg-slate-200 before:dark:bg-darkmode-400 before:ml-5 before:mt-5">
                <div class="intro-x relative flex items-center mb-3" v-for="recent in dashboardStats?.recent_activities || []" :key="recent.id">
                  <div class="before:block before:absolute before:w-20 before:h-px before:bg-slate-200 before:dark:bg-darkmode-400 before:mt-5 before:ml-5">
                    <div class="w-10 h-10 flex-none rounded-full bg-primary/10 flex items-center justify-center font-bold text-lg overflow-hidden">
                      <!-- <img alt="Profile" :src="recent.avatar"> -->
                      {{ getAvatarInitials(recent.title, recent.id) }}
                    </div>
                  </div>
                  <div class="box px-5 py-3 ml-4 flex-1 zoom-in">
                    <div class="flex items-center">
                      <div class="font-medium">{{ recent.title }}</div>
                      <div class="text-xs text-slate-500 ml-auto">{{ formatChatTime(recent.created) }}</div>
                    </div>
                    <div class="text-slate-500 mt-1">{{ recent.description }}</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- END: Recent Activities -->
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
// Helper to format chat time for dashboard and chat list
function formatChatTime(dateStr: string): string {
  const messageDate = new Date(dateStr);
  if (isNaN(messageDate.getTime())) return '';
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDate = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
  const diffTime = today.getTime() - msgDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    // Today - show time with AM/PM
    return messageDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: true });
  } else if (diffDays === 1) {
    return 'Kemarin';
  } else if (diffDays >= 2 && diffDays <= 7) {
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return dayNames[messageDate.getDay()];
  } else {
    const day = messageDate.getDate().toString().padStart(2, '0');
    const month = (messageDate.getMonth() + 1).toString().padStart(2, '0');
    const year = messageDate.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  }
}

import { ref, onMounted, watch, computed } from 'vue'
import { refreshIcons } from '../../utils/icon';

import DashboardLayout from '../../components/Layout/DashboardLayout.vue'
import BarChart from '../../components/ui/BarChart.vue'
import { utilsService } from '../../services/utils-service';
import { formatDateIndo } from '../../utils/formatDateIndo';
import type { DashboardStats, AgentResponseTime } from '../../interfaces/utils.interface';

// Helper to get two initials from customer name, fallback to customer id
function getAvatarInitials(name?: string, id?: string | number): string {
  if (name && name.trim().length > 0) {
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    } else {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
  } else if (id) {
    return String(id).substring(0, 2).toUpperCase();
  }
  return '--';
}

const dashboardStats = ref<DashboardStats | null>(null);
const responseTimeTitle = ref('-');

// Computed property for chart data
const chartData = computed(() => {
  const responseData = dashboardStats.value?.agent_response_times || [];
  return {
    labels: responseData.map((agent: AgentResponseTime) => agent.agent_name),
    datasets: [
      {
        label: 'Average Response Time (minutes)',
        data: responseData.map((agent: AgentResponseTime) => agent.average_response_time_minutes),
        backgroundColor: 'rgba(5, 150, 105, 0.7)', // #059669 with 70% opacity
        borderColor: '#059669', // Tailwind bg-primary
        borderWidth: 1
      }
    ]
  };
});

async function fetchDashboardStats() {
  try {
    const stats = await utilsService.getDashboardStats();
    dashboardStats.value = stats;
    if (stats.agent_response_times && stats.agent_response_times.length > 0) {
      const avg = stats.agent_response_times.reduce((acc: number, a: AgentResponseTime) => acc + a.average_response_time_minutes, 0) / stats.agent_response_times.length;
      responseTimeTitle.value = avg.toFixed(2);
    } else {
      responseTimeTitle.value = '-';
    }
  } catch (e) {
    console.error('Error:', e);
    responseTimeTitle.value = '-';
    dashboardStats.value = null;
  }
}

function refreshData() {
  fetchDashboardStats();
}



onMounted(() => {
  fetchDashboardStats();
  refreshIcons();
});

// Watch dashboardStats and update feather icons after data changes
watch(dashboardStats, () => {
  refreshIcons();
});

</script>

<style scoped>
/* Dashboard specific styles */
.report-box__icon {
  width: 2rem;
  height: 2rem;
}

.divider-dotted {
  border-top: 1px dotted #e2e8f0;
}

.report-box__indicator {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
}

.table-striped tbody tr:nth-child(odd) {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>
