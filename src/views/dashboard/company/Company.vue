<template>
  <DashboardLayout>
    <div class="intro-y box px-5 pt-5 mt-5">
      <div class="flex flex-col lg:flex-row border-b border-slate-200/60 pb-5 -mx-5">
        <div class="flex flex-1 px-5 items-center justify-center lg:justify-start">
          <div class="w-20 h-20 sm:w-24 sm:h-24 flex-none lg:w-32 lg:h-32 image-fit relative">
            <img :src="defaultLogo" class="rounded-full" alt="Company Logo" />
          </div>
          <div class="ml-5">
            <div class="w-24 sm:w-40 truncate font-medium text-lg">{{ company.name }}</div>
            <div class="text-slate-500">Kode: {{ company.code }}</div>
          </div>
        </div>
        <div class="mt-6 lg:mt-0 flex-1 px-5 border-l border-r border-slate-200/60 border-t lg:border-t-0 pt-5 lg:pt-0">
          <div class="font-medium text-center lg:text-left lg:mt-3">Contact Details</div>
          <div class="flex flex-col justify-center items-center lg:items-start mt-4">
            <div class="truncate flex items-center">
              <i data-feather="mail" class="w-4 h-4 mr-2"></i> {{ company.email || '-' }}
            </div>
            <div class="truncate flex items-center mt-3">
              <i data-feather="phone" class="w-4 h-4 mr-2"></i> {{ company.phone }}
            </div>
            <!-- <div class="truncate flex items-center mt-3" v-if="company.address">
              <i data-feather="map-pin" class="w-4 h-4 mr-2"></i> {{ company.address }}
            </div> -->
          </div>
        </div>
        <div class="mt-6 lg:mt-0 flex-1 flex items-center justify-center px-5 border-t lg:border-0 border-slate-200/60 pt-5 lg:pt-0">
          <div class="text-center rounded-md w-20 py-3">
            <div class="font-medium text-primary text-xl">{{ company.created ? company.created.split(' ')[0] : '-' }}</div>
            <div class="text-slate-500">Created</div>
          </div>
          <div class="text-center rounded-md w-20 py-3">
            <div class="font-medium text-primary text-xl">{{ company.lastEdited ? company.lastEdited.split(' ')[0] : '-' }}</div>
            <div class="text-slate-500">Last Edited</div>
          </div>
        </div>
      </div>

      <form class="mt-8" @submit.prevent="onUpdateCompany">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="form-label">Company Name</label>
            <input v-model="form.name" class="form-control" type="text" />
          </div>
          <div>
            <label class="form-label">Code</label>
            <input v-model="form.code" class="form-control" type="text" />
          </div>
          <div>
            <label class="form-label">Phone</label>
            <input v-model="form.phone" class="form-control" type="text" />
          </div>
          <!-- <div>
            <label class="form-label">Email</label>
            <input v-model="form.email" class="form-control" type="email" />
          </div>
          <div>
            <label class="form-label">Address</label>
            <input v-model="form.address" class="form-control" type="text" />
          </div> -->
        </div>
        <button class="btn btn-primary mt-4" type="submit">Update Company</button>
      </form>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">

import { ref, reactive, onMounted, watch } from 'vue';
import DashboardLayout from '../../../components/Layout/DashboardLayout.vue';
import { useAuth } from '../../../composables/useAuth';
import { companyService } from '../../../services/company-service';
import { useNotification } from '../../../composables/useNotification';


const defaultLogo = '/public/logo.svg';
interface Company {
  name?: string;
  code?: string;
  phone?: string;
  email?: string;
  address?: string;
  created?: string;
  lastEdited?: string;
}

const company = ref<Company>({});
const form = reactive({
  name: '',
  code: '',
  phone: '',
  email: '',
  address: ''
});
const { user } = useAuth();
const { showSuccessNotification } = useNotification();

// function debugUser() {
//   console.log('DEBUG user:', user.value);
//   if (user.value) {
//     console.log('DEBUG user.value.user:', user.value.user);
//     console.log('DEBUG companyId:', user.value.user?.companyId);
//   }
// }

async function fetchCompany() {
  // debugUser();
  // Ambil company langsung dari getCompanies (tanpa id, backend sudah filter)
  const companies = await companyService.getCompanies();
  const data: Company = Array.isArray(companies) && companies.length > 0 ? companies[0] : {};
  // console.log('DEBUG company API response:', data);
  company.value = data;
  form.name = data.name || '';
  form.code = data.code || '';
  form.phone = data.phone || '';
//   form.email = data.email || '';
//   form.address = data.address || '';
}

onMounted(fetchCompany);

// Jika user berubah (misal setelah login), refetch company
watch(user, fetchCompany, { immediate: false });

async function onUpdateCompany() {
  const companyId = user.value?.user?.companyId;
  if (!companyId) return;
  const updated = await companyService.updateCompany(companyId, {
    name: form.name,
    code: form.code,
    phone: form.phone,
    email: form.email,
    address: form.address
  });
  company.value = updated;
  showSuccessNotification('Company updated successfully');
}
</script>