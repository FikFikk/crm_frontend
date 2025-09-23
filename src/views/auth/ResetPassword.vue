// src/views/auth/Login.vue
<template>
  <div class="login">
    <div class="container sm:px-10">
      <div class="block xl:grid grid-cols-2 gap-4">
        <!-- BEGIN: Login Info -->
        <div class="hidden xl:flex flex-col min-h-screen">
          <a href="" class="-intro-x flex items-center pt-5">
            <img alt="Tinker Tailwind HTML Admin Template" class="w-6" :src="logoImage">
            <span class="text-white text-lg ml-3"> Mini - CRM </span> 
          </a>
          <div class="my-auto">
            <img alt="Tinker Tailwind HTML Admin Template" class="-intro-x w-1/2 -mt-16" :src="illustrationImage">
            <div class="-intro-x text-white font-medium text-4xl leading-tight mt-10">
              A few more clicks to 
              <br>
              sign in to your account.
            </div>
            <div class="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400">Manage all your e-commerce accounts in one place</div>
          </div>
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <div class="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
          <div class="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
            <h2 class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
              Reset Password
            </h2>
            <div class="intro-x mt-2 text-slate-400 xl:hidden text-center">A few more clicks to sign in to your account. Manage all your e-commerce accounts in one place</div>
            <div class="intro-x mt-8">
              <input v-model="email" type="email" class="intro-x login__input form-control py-3 px-4 block" placeholder="Email" required autocomplete="email">
            </div>
            <div v-if="error" class="text-danger text-xs mt-2">{{ error }}</div>
            <div v-if="success" class="text-success text-xs mt-2">{{ success }}</div>
            <div class="intro-x flex text-slate-600 dark:text-slate-500 text-xs sm:text-sm mt-4">
              <div class="flex items-center mr-auto">
                <router-link to="/login" class="cursor-pointer select-none">Back to Login?</router-link>
              </div>
              <router-link to="/set-password">Not redirect?</router-link>
            </div>
            <div class="intro-x mt-5 xl:mt-8 text-center xl:text-left">
              <button type="button" class="btn btn-primary py-3 px-4 w-full align-top" :disabled="loading" @click="handleResetPassword">
                <span v-if="loading">Sending...</span>
                <span v-else>Reset Password</span>
              </button>
            </div>
          </div>
        </div>
        <!-- END: Login Form -->
      </div>
    </div>
    <!-- BEGIN: Dark Mode Switcher-->
    <DarkModeSwitcher />
    <!-- END: Dark Mode Switcher-->
  </div>
</template>


<script setup lang="ts">
import DarkModeSwitcher from '../../components/Layout/DarkModeSwitcher.vue'
import { ref } from 'vue'
import { authService } from '../../services/auth-service'
import { useRouter } from 'vue-router'
import { useNotification } from '../../composables/useNotification'
import logoImage from '../../assets/images/logo.svg'
import illustrationImage from '../../assets/images/illustration.svg'

const email = ref('')
const loading = ref(false)
const error = ref<string|null>(null)
const success = ref<string|null>(null)
const router = useRouter()
const { showSuccessNotification } = useNotification()

async function handleResetPassword() {
  error.value = null
  success.value = null
  if (!email.value) {
    error.value = 'Email is required'
    return
  }
  loading.value = true
  try {
    const res = await authService.resetPassword(email.value)
    if (res.success) {
      success.value = res.message || 'Reset code sent to your email.'
  showSuccessNotification(success.value || 'Reset code sent to your email.')
      setTimeout(() => {
        router.push('/set-password')
      }, 5000)
    } else {
      error.value = res.message || 'Failed to send reset code.'
    }
  } catch (e: unknown) {
    error.value = (e as Error)?.message || 'Failed to send reset code.'
  } finally {
    loading.value = false
  }
}
</script>
