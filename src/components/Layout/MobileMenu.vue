<template>
  <div class="mobile-menu md:hidden">
    <div class="mobile-menu-bar">
      <a href="" class="flex mr-auto">
        <img alt="Tinker Tailwind HTML Admin Template" class="w-6" :src="logoImage">
      </a>
      <a href="javascript:;" @click="toggleMobileMenu"> 
        <i data-feather="bar-chart-2" class="w-8 h-8 text-white transform -rotate-90"></i> 
      </a>
    </div>
    
    <ul class="border-t border-white/[0.08] py-5" :class="{ 'hidden': !mobileMenuOpen }">
      <li>
        <a href="javascript:;" class="menu" :class="{ 'menu--active': currentPage === 'dashboard' }" @click="toggleSubmenu('dashboard')">
          <div class="menu__icon"> <i data-feather="home"></i> </div>
          <div class="menu__title"> 
            Dashboard 
            <i data-feather="chevron-down" class="menu__sub-icon" :class="{ 'transform rotate-180': submenuOpen.dashboard }"></i> 
          </div>
        </a>
        <ul :class="{ 'menu__sub-open': submenuOpen.dashboard, '': !submenuOpen.dashboard }">
          <li>
            <router-link :to="{ name: 'Dashboard' }" class="menu" :class="{ 'menu--active': $route.name === 'Dashboard' }">
              <div class="menu__icon"> <i data-feather="activity"></i> </div>
              <div class="menu__title"> Overview </div>
            </router-link>
          </li>
        </ul>
      </li>
      
      <li>
        <router-link to="/customers" class="menu">
          <div class="menu__icon"> <i data-feather="users"></i> </div>
          <div class="menu__title"> Customers </div>
        </router-link>
      </li>
      
      <li>
        <router-link to="/leads" class="menu">
          <div class="menu__icon"> <i data-feather="target"></i> </div>
          <div class="menu__title"> Leads </div>
        </router-link>
      </li>
      
      <li>
        <router-link to="/opportunities" class="menu">
          <div class="menu__icon"> <i data-feather="trending-up"></i> </div>
          <div class="menu__title"> Opportunities </div>
        </router-link>
      </li>
      
      <li>
        <router-link to="/activities" class="menu">
          <div class="menu__icon"> <i data-feather="calendar"></i> </div>
          <div class="menu__title"> Activities </div>
        </router-link>
      </li>
      
      <li class="menu__devider my-6"></li>
      
      <li>
        <a href="javascript:;" class="menu" @click="toggleSubmenu('reports')">
          <div class="menu__icon"> <i data-feather="bar-chart-2"></i> </div>
          <div class="menu__title"> 
            Reports 
            <i data-feather="chevron-down" class="menu__sub-icon" :class="{ 'transform rotate-180': submenuOpen.reports }"></i> 
          </div>
        </a>
        <ul :class="{ 'menu__sub-open': submenuOpen.reports, '': !submenuOpen.reports }">
          <li>
            <router-link to="/reports/sales" class="menu">
              <div class="menu__icon"> <i data-feather="activity"></i> </div>
              <div class="menu__title"> Sales Report </div>
            </router-link>
          </li>
          <li>
            <router-link to="/reports/customers" class="menu">
              <div class="menu__icon"> <i data-feather="activity"></i> </div>
              <div class="menu__title"> Customer Report </div>
            </router-link>
          </li>
        </ul>
      </li>
      
      <li>
        <a href="javascript:;" class="menu" @click="toggleSubmenu('settings')">
          <div class="menu__icon"> <i data-feather="settings"></i> </div>
          <div class="menu__title"> 
            Settings 
            <i data-feather="chevron-down" class="menu__sub-icon" :class="{ 'transform rotate-180': submenuOpen.settings }"></i> 
          </div>
        </a>
        <ul :class="{ 'menu__sub-open': submenuOpen.settings, '': !submenuOpen.settings }">
          <li>
            <router-link to="/settings/profile" class="menu">
              <div class="menu__icon"> <i data-feather="activity"></i> </div>
              <div class="menu__title"> Profile </div>
            </router-link>
          </li>
          <li>
            <router-link to="/settings/users" class="menu">
              <div class="menu__icon"> <i data-feather="activity"></i> </div>
              <div class="menu__title"> Users </div>
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import logoImage from '../../assets/images/logo.svg'

const route = useRoute()
const mobileMenuOpen = ref(false)
const submenuOpen = ref({
  dashboard: false,
  reports: false,
  settings: false
})

const currentPage = computed(() => {
  return route.name?.toString().toLowerCase() || ''
})

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const toggleSubmenu = (menu: keyof typeof submenuOpen.value) => {
  submenuOpen.value[menu] = !submenuOpen.value[menu]
}
</script>

<style scoped>
/* Mobile menu styles akan menggunakan CSS dari template */
</style>
