<template>
  <div v-if="show" class="modal-overlay" @click.self="handleBackdropClick">
    <div class="modal-container" :style="{ width, maxWidth }">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button type="button" @click="closeModal" class="btn btn-outline-secondary w-8 h-8 p-0" :disabled="loading">
            <i data-feather="x" class="w-4 h-4"></i>
          </button>
        </div>
        <div class="modal-body">
          <slot name="body" />
        </div>
        <div class="modal-footer" v-if="$slots.footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean;
  title: string;
  width?: string;
  maxWidth?: string;
  loading?: boolean;
  closeOnBackdrop?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  width: '90%',
  maxWidth: '500px',
  loading: false,
  closeOnBackdrop: true
});
const emit = defineEmits<{
  'update:show': [show: boolean];
  'close': [];
}>();
const closeModal = () => {
  emit('update:show', false);
  emit('close');
};
const handleBackdropClick = () => {
  if (props.closeOnBackdrop && !props.loading) {
    closeModal();
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-container {
  position: relative;
  margin: 0;
}
.modal-content {
  position: relative;
  background-color: #fff;
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.2);
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  background-color: #fff;
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
}
.modal-title {
  font-weight: 500;
  font-size: 1rem;
  margin: 0;
  color: #000;
}
.modal-body {
  position: relative;
  padding: 1rem;
  background-color: #fff;
}
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem;
  border-top: 1px solid #dee2e6;
  background-color: #fff;
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}
</style>
