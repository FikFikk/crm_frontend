<template>
  <div class="login">
    <div class="container sm:px-10">
      <div class="block xl:grid grid-cols-2 gap-4">
        <!-- BEGIN: Register Info -->
        <div class="hidden xl:flex flex-col min-h-screen">
          <a href="" class="-intro-x flex items-center pt-5">
            <img alt="Mini CRM Logo" class="w-6" src="/logo.svg">
            <span class="text-white text-lg ml-3"> Mini CRM </span> 
          </a>
          <div class="my-auto">
            <img alt="Mini CRM Illustration" class="-intro-x w-1/2 -mt-16" src="/illustration.svg">
            <div class="-intro-x text-white font-medium text-4xl leading-tight mt-10">
              A few more clicks to 
              <br>
              sign up to your account.
            </div>
            <div class="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400">
              Manage all your CRM accounts in one place
            </div>
          </div>
        </div>
        <!-- END: Register Info -->
        
        <!-- BEGIN: Register Form -->
        <div class="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
          <div class="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
            <h2 class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
              Sign Up
            </h2>
            <div class="intro-x mt-2 text-slate-400 dark:text-slate-400 xl:hidden text-center">
              A few more clicks to create your account. Manage all your CRM accounts in one place
            </div>
            
            <form @submit.prevent="handleRegister" class="intro-x mt-8">
              <input 
                type="text" 
                v-model="registerForm.firstName"
                class="intro-x login__input form-control py-3 px-4 block" 
                placeholder="First Name"
                required
              >
              <input 
                type="text" 
                v-model="registerForm.lastName"
                class="intro-x login__input form-control py-3 px-4 block mt-4" 
                placeholder="Last Name"
                required
              >
              <input 
                type="email" 
                v-model="registerForm.email"
                class="intro-x login__input form-control py-3 px-4 block mt-4" 
                placeholder="Email"
                required
              >
              <input 
                type="password" 
                v-model="registerForm.password"
                @input="checkPasswordStrength"
                class="intro-x login__input form-control py-3 px-4 block mt-4" 
                placeholder="Password"
                required
              >
              
              <!-- Password Strength Indicator -->
              <div class="intro-x w-full grid grid-cols-12 gap-4 h-1 mt-3">
                <div 
                  v-for="i in 4" 
                  :key="i"
                  class="col-span-3 h-full rounded"
                  :class="getPasswordStrengthClass(i)"
                ></div>
              </div>
              <a href="" class="intro-x text-slate-500 block mt-2 text-xs sm:text-sm">
                What is a secure password?
              </a>
              
              <input 
                type="password" 
                v-model="registerForm.passwordConfirmation"
                class="intro-x login__input form-control py-3 px-4 block mt-4" 
                placeholder="Password Confirmation"
                required
              >
              
              <!-- Password mismatch warning -->
              <div v-if="passwordMismatch" class="text-red-500 text-sm mt-2">
                Passwords do not match
              </div>
              
              <div class="intro-x flex items-center text-slate-600 dark:text-slate-500 mt-4 text-xs sm:text-sm">
                <input 
                  id="terms-checkbox" 
                  type="checkbox" 
                  v-model="registerForm.agreeToTerms"
                  class="form-check-input border mr-2"
                  required
                >
                <label class="cursor-pointer select-none" for="terms-checkbox">
                  I agree to the
                </label>
                <a class="text-primary dark:text-slate-200 ml-1" href="">Privacy Policy</a>.
              </div>
              
              <div class="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                <button 
                  type="submit" 
                  class="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top"
                  :disabled="isLoading || !canRegister"
                >
                  {{ isLoading ? 'Loading...' : 'Register' }}
                </button>
                <button 
                  type="button"
                  @click="$router.push('/login')"
                  class="btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
        <!-- END: Register Form -->
      </div>
    </div>
    
    <!-- BEGIN: Dark Mode Switcher-->
    <div 
      @click="toggleDarkMode"
      class="dark-mode-switcher cursor-pointer shadow-md fixed bottom-0 right-0 box dark:bg-dark-2 border rounded-full w-40 h-12 flex items-center justify-center z-50 mb-10 mr-10"
    >
      <div class="mr-4 text-gray-700 dark:text-gray-300">Dark Mode</div>
      <div class="dark-mode-switcher__toggle border"></div>
    </div>
    <!-- END: Dark Mode Switcher-->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(false)
const passwordStrength = ref(0)

const registerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  agreeToTerms: false
})

const passwordMismatch = computed(() => {
  return registerForm.password !== '' && 
         registerForm.passwordConfirmation !== '' && 
         registerForm.password !== registerForm.passwordConfirmation
})

const canRegister = computed(() => {
  return registerForm.firstName !== '' &&
         registerForm.lastName !== '' &&
         registerForm.email !== '' &&
         registerForm.password !== '' &&
         registerForm.passwordConfirmation !== '' &&
         registerForm.password === registerForm.passwordConfirmation &&
         registerForm.agreeToTerms
})

const checkPasswordStrength = () => {
  const password = registerForm.password
  let strength = 0
  
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  
  passwordStrength.value = strength
}

const getPasswordStrengthClass = (index: number) => {
  if (index <= passwordStrength.value) {
    if (passwordStrength.value <= 1) return 'bg-red-500'
    if (passwordStrength.value <= 2) return 'bg-yellow-500'
    if (passwordStrength.value <= 3) return 'bg-blue-500'
    return 'bg-green-500'
  }
  return 'bg-slate-100 dark:bg-darkmode-800'
}

const handleRegister = async () => {
  if (!canRegister.value) return
  
  try {
    isLoading.value = true
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // TODO: Implement actual registration logic here
    console.log('Registration attempted with:', {
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
      email: registerForm.email,
      // Don't log password in production
    })
    
    // Navigate to login after successful registration
    router.push('/login')
    
  } catch (error) {
    console.error('Registration error:', error)
    // TODO: Handle registration error
  } finally {
    isLoading.value = false
  }
}

const toggleDarkMode = () => {
  // TODO: Implement dark mode toggle
  console.log('Dark mode toggle clicked')
}
</script>

<style scoped>
/* Register specific styles that exactly match the template */
.login {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.login__input {
  width: 100%;
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #1e293b;
  transition: all 0.15s ease-in-out;
}

.login__input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.login__input::placeholder {
  color: #94a3b8;
}

.form-control {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  appearance: none;
  border-radius: 0.375rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.btn {
  display: inline-block;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.btn-primary {
  color: #fff;
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.btn-primary:hover:not(:disabled) {
  color: #fff;
  background-color: #2563eb;
  border-color: #1d4ed8;
}

.btn-primary:disabled {
  color: #fff;
  background-color: #3b82f6;
  border-color: #3b82f6;
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-outline-secondary {
  color: #6c757d;
  border-color: #6c757d;
}

.btn-outline-secondary:hover {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.form-check-input {
  width: 1em;
  height: 1em;
  margin-top: 0.25em;
  vertical-align: top;
  background-color: #fff;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  border: 1px solid rgba(0, 0, 0, 0.25);
  appearance: none;
  border-radius: 0.25em;
}

.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.form-check-input:focus {
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.text-primary {
  color: #3b82f6 !important;
}

.text-red-500 {
  color: #ef4444 !important;
}

.bg-red-500 {
  background-color: #ef4444 !important;
}

.bg-yellow-500 {
  background-color: #eab308 !important;
}

.bg-blue-500 {
  background-color: #3b82f6 !important;
}

.bg-green-500 {
  background-color: #22c55e !important;
}

.bg-slate-100 {
  background-color: #f1f5f9 !important;
}

.dark-mode-switcher {
  background-color: #fff;
  color: #374151;
}

.dark-mode-switcher__toggle {
  width: 1.5rem;
  height: 0.75rem;
  background-color: #e5e7eb;
  border-radius: 0.75rem;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dark-mode-switcher__toggle::before {
  content: '';
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  width: 0.5rem;
  height: 0.5rem;
  background-color: #fff;
  border-radius: 50%;
  transition: transform 0.2s;
}

.box {
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

/* Animation classes exactly like the template */
.intro-x {
  opacity: 0;
  transform: translateY(20px);
  animation: intro-x 0.6s ease-out forwards;
}

.-intro-x {
  opacity: 0;
  transform: translateY(-20px);
  animation: intro-x-reverse 0.6s ease-out forwards;
}

@keyframes intro-x {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes intro-x-reverse {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stagger animation delays */
.intro-x:nth-child(1) { animation-delay: 0.1s; }
.intro-x:nth-child(2) { animation-delay: 0.2s; }
.intro-x:nth-child(3) { animation-delay: 0.3s; }
.intro-x:nth-child(4) { animation-delay: 0.4s; }
.intro-x:nth-child(5) { animation-delay: 0.5s; }
.intro-x:nth-child(6) { animation-delay: 0.6s; }
.intro-x:nth-child(7) { animation-delay: 0.7s; }

.-intro-x:nth-child(1) { animation-delay: 0.1s; }
.-intro-x:nth-child(2) { animation-delay: 0.2s; }
.-intro-x:nth-child(3) { animation-delay: 0.3s; }

.align-top {
  vertical-align: top !important;
}
</style>
