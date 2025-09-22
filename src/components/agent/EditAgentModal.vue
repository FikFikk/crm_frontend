<template>
  <Modal
    v-model:show="isVisible"
    title="Edit Agent"
    :loading="isUpdating"
    @close="handleClose"
  >
    <template #body>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="firstName" class="form-label">First Name <span class="text-danger">*</span></label>
          <input id="firstName" type="text" class="form-control" placeholder="Enter first name" v-model="formData.firstName" :disabled="isUpdating" required>
        </div>
        <div class="mb-3">
          <label for="surname" class="form-label">Surname</label>
          <input id="surname" type="text" class="form-control" placeholder="Enter surname (optional)" v-model="formData.surname" :disabled="isUpdating">
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
          <input id="email" type="email" class="form-control" placeholder="Enter email address" v-model="formData.email" :disabled="isUpdating" required>
        </div>
        <div class="mb-3">
          <label for="phone" class="form-label">Phone</label>
          <input id="phone" type="text" class="form-control" placeholder="Enter phone number" v-model="formData.phone" :disabled="isUpdating">
        </div>
        <div class="mb-3">
          <label for="address" class="form-label">Address</label>
          <input id="address" type="text" class="form-control" placeholder="Enter address" v-model="formData.address" :disabled="isUpdating">
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input id="password" type="password" class="form-control" placeholder="Leave blank to keep current password" v-model="formData.password" :disabled="isUpdating">
        </div>
      </form>
    </template>
    <template #footer>
      <button type="button" @click="handleClose" class="btn btn-outline-secondary w-20 mr-1" :disabled="isUpdating">Cancel</button>
      <button type="button" @click="handleSubmit" class="btn btn-primary w-20" :disabled="isUpdating || !isFormValid">
        <span v-if="isUpdating">
          <i class="w-4 h-4 mr-2 animate-spin" data-feather="loader"></i>
          Saving...
        </span>
        <span v-else>Save</span>
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Modal from '../ui/Modal.vue';
import type { Agent, UpdateAgentRequest } from '../../interfaces/agent.interface';

interface Props {
  show: boolean;
  agent?: Agent | null;
  loading?: boolean;
}
const props = withDefaults(defineProps<Props>(), { loading: false });
const emit = defineEmits<{
  'update:show': [show: boolean];
  'submit': [data: { id: number, data: UpdateAgentRequest }];
  'close': [];
}>();
const isVisible = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
});
const isUpdating = computed(() => props.loading);
const formData = ref<UpdateAgentRequest & { password?: string }>({
  firstName: '',
  surname: '',
  email: '',
  phone: '',
  address: '',
  password: ''
});
const error = ref<string | null>(null);
const success = ref<string | null>(null);
const isFormValid = computed(() => {
  return (formData.value.firstName || '').trim() !== '' &&
         (formData.value.email || '').trim() !== '';
});
const handleSubmit = () => {
  if (!isFormValid.value || isUpdating.value || !props.agent) return;
  const updateData: UpdateAgentRequest = {
    firstName: formData.value.firstName,
    surname: formData.value.surname,
    email: formData.value.email,
    phone: formData.value.phone,
    address: formData.value.address,
    password: formData.value.password || undefined
  };
  emit('submit', { id: props.agent.id, data: updateData });
};
const handleClose = () => {
  resetForm();
  emit('close');
};
const resetForm = () => {
  formData.value = {
    firstName: '',
    surname: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  };
  error.value = null;
  success.value = null;
};
const setError = (message: string) => {
  error.value = message;
  success.value = null;
};
const setSuccess = (message: string) => {
  success.value = message;
  error.value = null;
};
watch(() => props.show, (newShow) => {
  if (newShow && props.agent) {
    formData.value = {
      firstName: props.agent.firstName || '',
      surname: props.agent.surname || '',
      email: props.agent.email || '',
      phone: props.agent.phone || '',
      address: (props.agent as Agent & { address?: string })?.address || '',
      password: ''
    };
    error.value = null;
    success.value = null;
  }
});
defineExpose({ setError, setSuccess, resetForm });
</script>

<style scoped>
/* Component specific styles if needed */
</style>
