<script setup lang="ts">
/* --------------------------------------------------------------------------
 * Imports
 * -------------------------------------------------------------------------- */
import { reactive, onMounted, nextTick } from 'vue'
import logoImage from '../../assets/images/logo.svg'

// Ambil currentUser dari localStorage (auth context) sebagai reactive object
const currentUser = reactive<{ role?: string | null }>({ role: null });
function loadCurrentUser() {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const userObj = JSON.parse(userStr);
      currentUser.role = userObj.user?.role || null;
    } catch {
      currentUser.role = null;
    }
  } else {
    currentUser.role = null;
  }
}
loadCurrentUser();

// console.log('DEBUG currentUser:', currentUser);

/* --------------------------------------------------------------------------
 * State (data)
 * -------------------------------------------------------------------------- */
// const submenuOpen = ref({
//   dashboard: true,
//   reports: false,
//   settings: false
// })

/* --------------------------------------------------------------------------
 * Methods
 * -------------------------------------------------------------------------- */
// const toggleSubmenu = (menu: keyof typeof submenuOpen.value) => {
//   submenuOpen.value[menu] = !submenuOpen.value[menu]
// }

/* --------------------------------------------------------------------------
 * Lifecycle Hooks
 * -------------------------------------------------------------------------- */
onMounted(() => {
  nextTick(() => {
    // Initialize Feather icons
    if (window.feather) {
      window.feather.replace()
    }
  })
})
</script>


<template>
  <nav class="side-nav">
    <a href="" class="intro-x flex items-center pl-5 pt-4 mt-3">
      <img alt="Mini CRM Logo" class="w-6" :src="logoImage">
      <span class="text-white text-lg ml-3" style="display: block !important;"> Mini - CRM </span> 
    </a>
    <div class="side-nav__devider my-6"></div>
    

    <ul>
      <!-- Jika anggota, hanya tampilkan menu Chat -->
      <template v-if="currentUser.role && currentUser.role.toLowerCase() === 'agent'">
        <li>
          <router-link to="/chat" class="side-menu" :class="{ 'side-menu--active': $route.name === 'Chat' }">
            <div class="side-menu__icon"> <i data-feather="message-square"></i> </div>
            <div class="side-menu__title"> Chat </div>
          </router-link>
        </li>
      </template>
      <!-- Jika bukan anggota, tampilkan semua menu -->
      <template v-else>
        <li>
          <router-link to="/dashboard" class="side-menu" :class="{ 'side-menu--active': $route.name === 'Dashboard' }">
            <div class="side-menu__icon"> <i data-feather="home"></i> </div>
            <div class="side-menu__title"> Dashboard </div>
          </router-link>
        </li>
        <li>
          <router-link to="/chat" class="side-menu" :class="{ 'side-menu--active': $route.name === 'Chat' }">
            <div class="side-menu__icon"> <i data-feather="message-square"></i> </div>
            <div class="side-menu__title"> Chat </div>
          </router-link>
        </li>
        <li>
          <router-link to="/agents" class="side-menu" :class="{ 'side-menu--active': $route.name === 'Agents' }">
            <div class="side-menu__icon"> <i data-feather="users"></i> </div>
            <div class="side-menu__title"> Agent </div>
          </router-link>
        </li>
        <li>
          <router-link to="/company" class="side-menu" :class="{ 'side-menu--active': $route.name === 'Company' }">
            <div class="side-menu__icon"> <i data-feather="code"></i> </div>
            <div class="side-menu__title"> Company  </div>
          </router-link>
        </li>
        <li>
          <router-link to="/whatsapp" class="side-menu" :class="{ 'side-menu--active': $route.name === 'WhatsApp' }">
            <div class="side-menu__icon"> <i data-feather="target"></i> </div>
            <div class="side-menu__title"> WhatsApp  </div>
          </router-link>
        </li>
      </template>

      <!-- <li>
        <router-link to="/leads" class="side-menu">
          <div class="side-menu__icon"> <i data-feather="target"></i> </div>
          <div class="side-menu__title"> Leads </div>
        </router-link>
      </li>
      
      <li>
        <router-link to="/opportunities" class="side-menu">
          <div class="side-menu__icon"> <i data-feather="trending-up"></i> </div>
          <div class="side-menu__title"> Opportunities </div>
        </router-link>
      </li>
      
      <li>
        <router-link to="/activities" class="side-menu">
          <div class="side-menu__icon"> <i data-feather="calendar"></i> </div>
          <div class="side-menu__title"> Activities </div>
        </router-link>
      </li> -->
      
      <!-- <li class="side-nav__devider my-6"></li>
      
      <li>
        <a href="javascript:;" class="side-menu" @click="toggleSubmenu('reports')">
          <div class="side-menu__icon"> <i data-feather="bar-chart-2"></i> </div>
          <div class="side-menu__title">
            Reports 
            <div class="side-menu__sub-icon" :class="{ 'transform rotate-180': submenuOpen.reports }"> 
              <i data-feather="chevron-down"></i> 
            </div>
          </div>
        </a>
        <ul :class="{ 'side-menu__sub-open': submenuOpen.reports, '': !submenuOpen.reports }">
          <li>
            <router-link to="/reports/sales" class="side-menu" :class="{ 'side-menu--active': $route.name === 'SalesReport' }">
              <div class="side-menu__icon"> <i data-feather="activity"></i> </div>
              <div class="side-menu__title"> Sales Report </div>
            </router-link>
          </li>
          <li>
            <router-link to="/reports/customers" class="side-menu" :class="{ 'side-menu--active': $route.name === 'CustomerReport' }">
              <div class="side-menu__icon"> <i data-feather="activity"></i> </div>
              <div class="side-menu__title"> Customer Report </div>
            </router-link>
          </li>
        </ul>
      </li>
      
      <li>
        <a href="javascript:;" class="side-menu" @click="toggleSubmenu('settings')">
          <div class="side-menu__icon"> <i data-feather="settings"></i> </div>
          <div class="side-menu__title">
            Settings 
            <div class="side-menu__sub-icon" :class="{ 'transform rotate-180': submenuOpen.settings }"> 
              <i data-feather="chevron-down"></i> 
            </div>
          </div>
        </a>
        <ul :class="{ 'side-menu__sub-open': submenuOpen.settings, '': !submenuOpen.settings }">
          <li>
            <router-link to="/settings/profile" class="side-menu" :class="{ 'side-menu--active': $route.name === 'Profile' }">
              <div class="side-menu__icon"> <i data-feather="activity"></i> </div>
              <div class="side-menu__title"> Profile </div>
            </router-link>
          </li>
          <li>
            <router-link to="/settings/users" class="side-menu" :class="{ 'side-menu--active': $route.name === 'Users' }">
              <div class="side-menu__icon"> <i data-feather="activity"></i> </div>
              <div class="side-menu__title"> Users </div>
            </router-link>
          </li>
        </ul>
      </li> -->
    </ul>
  </nav>
</template>

<style scoped>
/* Ensure side menu doesn't overflow */
.side-menu {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Side navigation container */
.side-nav {
  position: relative;
  overflow: visible;
}

/* Ensure logo text is always visible */
.side-nav a span {
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
  color: white !important;
  font-size: 1.125rem !important;
  margin-left: 0.75rem !important;
}

/* Logo container styling */
.side-nav .intro-x {
  opacity: 1 !important;
  visibility: visible !important;
  display: flex !important;
  align-items: center !important;
}
</style>
