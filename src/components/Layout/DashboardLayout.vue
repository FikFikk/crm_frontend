<template>
  <div class="md:py-0 bg-black/[0.15] dark:bg-transparent">
    <!-- BEGIN: Mobile Menu -->
    <MobileMenu />
    <!-- END: Mobile Menu -->
    
    <div class="flex overflow-hidden">
      <!-- BEGIN: Side Menu -->
      <SideMenu />
      <!-- END: Side Menu -->
      
      <!-- BEGIN: Content -->
      <div class="content">
        <!-- BEGIN: Top Bar -->
        <TopBar />
        <!-- END: Top Bar -->
        
        <!-- BEGIN: Page Content -->
        <slot />
        <!-- END: Page Content -->
      </div>
      <!-- END: Content -->
    </div>
      <DarkModeSwitcher />
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import MobileMenu from '../Layout/MobileMenu.vue'
import SideMenu from '../Layout/SideMenu.vue'
import TopBar from '../Layout/TopBar.vue'
import DarkModeSwitcher from '../Layout/DarkModeSwitcher.vue'
onMounted(() => {
  nextTick(() => {
    // refreshIcons() removed because '../../utils/icons' does not exist
  })
})
</script>

<style scoped>
/* Layout styles akan menggunakan CSS dari template */
</style>
