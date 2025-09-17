<template>
  <Modal
    v-model:show="isVisible"
    title="Add New Agent"
    :loading="isCreating"
    @close="handleClose"
  >
    <template #body>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="firstName" class="form-label">First Name <span class="text-danger">*</span></label>
          <input id="firstName" type="text" class="form-control" placeholder="Enter first name" v-model="formData.firstName" :disabled="isCreating" required>
        </div>
        <div class="mb-3">
          <label for="surname" class="form-label">Surname</label>
          <input id="surname" type="text" class="form-control" placeholder="Enter surname (optional)" v-model="formData.surname" :disabled="isCreating">
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
          <input id="email" type="email" class="form-control" placeholder="Enter email address" v-model="formData.email" :disabled="isCreating" required>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password <span class="text-danger">*</span></label>
          <input id="password" type="password" class="form-control" placeholder="Enter password" v-model="formData.password" :disabled="isCreating" required>
        </div>
      </form>
    </template>
    <template #footer>
      <button type="button" @click="handleClose" class="btn btn-outline-secondary w-20 mr-1" :disabled="isCreating">Cancel</button>
      <button type="button" @click="handleSubmit" class="btn btn-primary w-20" :disabled="isCreating || !isFormValid">
        <span v-if="isCreating">
          <i class="w-4 h-4 mr-2 animate-spin" data-feather="loader"></i>
          Creating...
        </span>
        <span v-else>Create</span>
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Modal from '../ui/Modal.vue';
import type { CreateAgentRequest } from '../../interfaces/agent.interface';

interface Props {
  show: boolean;
  loading?: boolean;
}
const props = withDefaults(defineProps<Props>(), { loading: false });
const emit = defineEmits<{
  'update:show': [show: boolean];
  'submit': [data: CreateAgentRequest];
  'close': [];
}>();
const isVisible = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
});
const isCreating = computed(() => props.loading);
const formData = ref({ firstName: '', surname: '', email: '', password: '' });
const error = ref<string | null>(null);
const success = ref<string | null>(null);
const isFormValid = computed(() => {
  return formData.value.firstName.trim() !== '' &&
         formData.value.email.trim() !== '' &&
         formData.value.password.trim() !== '';
});
const handleSubmit = () => {
  if (!isFormValid.value || isCreating.value) return;
  const agentData: CreateAgentRequest = {
    firstName: formData.value.firstName,
    surname: formData.value.surname || undefined,
    email: formData.value.email,
    password: formData.value.password,
    role: 'agent'
  };
  emit('submit', agentData);
};
const handleClose = () => {
  resetForm();
  emit('close');
};
const resetForm = () => {
  formData.value = { firstName: '', surname: '', email: '', password: '' };
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
  if (newShow) {
    resetForm();
  }
});
defineExpose({ setError, setSuccess, resetForm });
</script>

<style scoped>
/* Component specific styles if needed */
</style>
