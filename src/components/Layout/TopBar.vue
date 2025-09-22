<template>
  <div class="top-bar -mx-4 px-4 md:mx-0 md:px-0">
    <!-- BEGIN: Breadcrumb -->
    <nav aria-label="breadcrumb" class="intro-x mr-auto flex">
      <ol class="breadcrumb" style="display: flex; list-style: none; margin: 0; padding: 0;">
        <li class="breadcrumb-item" style="margin-right: 8px;">
          <a href="#" style="color: #94a3b8; text-decoration: none;">Application</a>
          <!-- <span style="margin-left: 8px; color: #94a3b8;">></span> -->
        </li>
        <li class="breadcrumb-item active" aria-current="page" style="color: #1e293b; font-weight: 500;">{{ currentPageTitle }}</li>
      </ol>
    </nav>
    <!-- END: Breadcrumb -->
    
    <!-- BEGIN: Search -->
    <div class="intro-x relative mr-3 sm:mr-6">
      <div class="search" style="position: relative; display: block;">
        <input 
          v-model="searchQuery"
          type="text" 
          class="search__input form-control border-transparent" 
          placeholder="Search..."
          @input="onSearch"
        >
        <i data-feather="search" class="search__icon dark:text-slate-500"></i> 
      </div>
      <a class="notification sm:hidden" href="#" @click.prevent="toggleMobileSearch"> 
        <i data-feather="search" class="notification__icon dark:text-slate-500"></i> 
      </a>
      
      <!-- Search Results -->
      <div class="search-result" v-show="showSearchResults">
        <div class="search-result__content">
          <div class="search-result__content__title">Pages</div>
          <div class="mb-5">
            <a href="#" class="flex items-center" @click.prevent="navigateTo('/inbox')">
              <div class="w-8 h-8 bg-success/20 dark:bg-success/10 text-success flex items-center justify-center rounded-full"> 
                <i class="w-4 h-4" data-feather="inbox"></i> 
              </div>
              <div class="ml-3">Mail Settings</div>
            </a>
            <a href="#" class="flex items-center mt-2" @click.prevent="navigateTo('/users')">
              <div class="w-8 h-8 bg-pending/10 text-pending flex items-center justify-center rounded-full"> 
                <i class="w-4 h-4" data-feather="users"></i> 
              </div>
              <div class="ml-3">Users & Permissions</div>
            </a>
            <a href="#" class="flex items-center mt-2" @click.prevent="navigateTo('/transactions')">
              <div class="w-8 h-8 bg-primary/10 dark:bg-primary/20 text-primary/80 flex items-center justify-center rounded-full"> 
                <i class="w-4 h-4" data-feather="credit-card"></i> 
              </div>
              <div class="ml-3">Transactions Report</div>
            </a>
          </div>
          
          <div class="search-result__content__title">Users</div>
          <div class="mb-5">
            <a href="#" class="flex items-center mt-2" v-for="user in searchUsers" :key="user.id">
              <div class="w-8 h-8 image-fit">
                <img alt="User" class="rounded-full" :src="user.avatar">
              </div>
              <div class="ml-3">{{ user.name }}</div>
              <div class="ml-auto w-48 truncate text-slate-500 text-xs text-right">{{ user.email }}</div>
            </a>
          </div>
          
          <div class="search-result__content__title">Products</div>
          <div class="mb-5">
            <a href="#" class="flex items-center mt-2" v-for="product in searchProducts" :key="product.id">
              <div class="w-8 h-8 image-fit">
                <img alt="Product" class="rounded-full" :src="product.image">
              </div>
              <div class="ml-3">{{ product.name }}</div>
              <div class="ml-auto w-48 truncate text-slate-500 text-xs text-right">{{ product.category }}</div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- END: Search -->
    
    <!-- BEGIN: Notifications -->
    <div class="intro-x dropdown sm:mr-6">
      <div class="dropdown-toggle notification notification--bullet cursor-pointer" role="button" aria-expanded="false" data-tw-toggle="dropdown"> 
        <i data-feather="bell" class="notification__icon dark:text-slate-500"></i> 
      </div>
      <div class="notification-content pt-2 dropdown-menu">
        <div class="notification-content__box dropdown-content">
          <div class="notification-content__title">Notifications</div>
          
          <div v-for="notification in notifications" :key="notification.id" class="cursor-pointer relative flex items-center" :class="{ 'mt-5': notification.id !== notifications[0]?.id }">
            <div class="w-12 h-12 flex-none image-fit mr-1">
              <img alt="User" class="rounded-full" :src="notification.avatar">
              <div class="w-3 h-3 bg-success absolute right-0 bottom-0 rounded-full border-2 border-white dark:border-darkmode-600"></div>
            </div>
            <div class="ml-2 overflow-hidden">
              <div class="flex items-center">
                <a href="javascript:;" class="font-medium truncate mr-5">{{ notification.name }}</a> 
                <div class="text-xs text-slate-400 ml-auto whitespace-nowrap">{{ notification.time }}</div>
              </div>
              <div class="w-full truncate text-slate-500 mt-0.5">{{ notification.message }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- END: Notifications -->
    
    <!-- BEGIN: Account Menu -->
    <div class="intro-x dropdown w-8 h-8" ref="userDropdown">
      <div class="dropdown-toggle w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in" role="button" aria-expanded="false" data-tw-toggle="dropdown">
        <img alt="User Avatar" :src="userAvatar">
      </div>
      <div class="dropdown-menu w-56" ref="userDropdownMenu">
        <ul class="dropdown-content bg-primary text-white">
          <li class="p-2">
            <div class="font-medium">{{ userDisplayName }}</div>
            <div class="text-xs text-white/70 mt-0.5 dark:text-slate-500">{{ userRole }}</div>
          </li>
          <li>
            <hr class="dropdown-divider border-white/[0.08]">
          </li>
          <li>
            <a href="#" class="dropdown-item hover:bg-white/5" @click.prevent="navigateTo('/profile')"> 
              <i data-feather="user" class="w-4 h-4 mr-2"></i> Profile 
            </a>
          </li>
          <li>
            <a href="#" class="dropdown-item hover:bg-white/5" @click.prevent="navigateTo('/add-account')"> 
              <i data-feather="edit" class="w-4 h-4 mr-2"></i> Add Account 
            </a>
          </li>
          <li>
            <a href="#" class="dropdown-item hover:bg-white/5" @click.prevent="navigateTo('/reset-password')"> 
              <i data-feather="lock" class="w-4 h-4 mr-2"></i> Reset Password 
            </a>
          </li>
          <li>
            <a href="#" class="dropdown-item hover:bg-white/5" @click.prevent="navigateTo('/help')"> 
              <i data-feather="help-circle" class="w-4 h-4 mr-2"></i> Help 
            </a>
          </li>
          <li>
            <hr class="dropdown-divider border-white/[0.08]">
          </li>
          <li>
            <a href="#" class="dropdown-item hover:bg-white/5" @click.prevent.stop="handleLogout"> 
              <i data-feather="toggle-right" class="w-4 h-4 mr-2"></i> Logout 
            </a>
          </li>
        </ul>
      </div>
    </div>
    <!-- END: Account Menu -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '../../services/auth-service'

const route = useRoute()
const router = useRouter()

// Data
const searchQuery = ref('')
const showSearchResults = ref(false)
const userDropdown = ref<HTMLElement | null>(null)
const userDropdownMenu = ref<HTMLElement | null>(null)

// User data from auth service
const currentUser = ref<{
  id: number
  email: string
  firstName: string
  surname: string
  role: string
  companyId?: number | null
  companyName?: string | null
} | null>(null)

// Search data matching template
const searchUsers = ref([
  {
    id: 1,
    name: 'Kevin Spacey',
    email: 'kevinspacey@left4code.com',
    avatar: '/assets/dist/images/profile-2.jpg'
  },
  {
    id: 2,
    name: 'Al Pacino',
    email: 'alpacino@left4code.com',
    avatar: '/assets/dist/images/profile-8.jpg'
  },
  {
    id: 3,
    name: 'Al Pacino',
    email: 'alpacino@left4code.com',
    avatar: '/assets/dist/images/profile-5.jpg'
  },
  {
    id: 4,
    name: 'Denzel Washington',
    email: 'denzelwashington@left4code.com',
    avatar: '/assets/dist/images/profile-11.jpg'
  }
])

const searchProducts = ref([
  {
    id: 1,
    name: 'Nike Tanjun',
    category: 'Sport & Outdoor',
    image: '/assets/dist/images/preview-11.jpg'
  },
  {
    id: 2,
    name: 'Oppo Find X2 Pro',
    category: 'Smartphone & Tablet',
    image: '/assets/dist/images/preview-15.jpg'
  },
  {
    id: 3,
    name: 'Dell XPS 13',
    category: 'PC & Laptop',
    image: '/assets/dist/images/preview-7.jpg'
  },
  {
    id: 4,
    name: 'Dell XPS 13',
    category: 'PC & Laptop',
    image: '/assets/dist/images/preview-12.jpg'
  }
])

const notifications = ref([
  {
    id: 1,
    name: 'Kevin Spacey',
    time: '05:09 AM',
    message: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 20',
    avatar: '/assets/dist/images/profile-2.jpg'
  },
  {
    id: 2,
    name: 'Al Pacino',
    time: '01:10 PM',
    message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500',
    avatar: '/assets/dist/images/profile-8.jpg'
  },
  {
    id: 3,
    name: 'Al Pacino',
    time: '06:05 AM',
    message: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem',
    avatar: '/assets/dist/images/profile-5.jpg'
  },
  {
    id: 4,
    name: 'Denzel Washington',
    time: '06:05 AM',
    message: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 20',
    avatar: '/assets/dist/images/profile-11.jpg'
  },
  {
    id: 5,
    name: 'Robert De Niro',
    time: '01:10 PM',
    message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500',
    avatar: '/assets/dist/images/profile-9.jpg'
  }
])

// Computed
const currentPageTitle = computed(() => {
  const pageTitles: { [key: string]: string } = {
    'Dashboard': 'Dashboard',
    'Customers': 'Customers',
    'Agents': 'Agent',
    'Chat': 'Chat',
    'Company': 'Company',
    'Whatsapp': 'Whatsapp'
  }
  return pageTitles[route.name as string] || 'Dashboard'
})

const userDisplayName = computed(() => {
  if (currentUser.value) {
    return `${currentUser.value.firstName} ${currentUser.value.surname}`.trim()
  }
  return 'Nama Pengguna' // fallback
})

const userRole = computed(() => {
  if (currentUser.value) {
    const roleNames: { [key: string]: string } = {
      'pimpinan': 'Pimpinan',
      'anggota': 'Anggota',
    }
    return roleNames[currentUser.value.role] || currentUser.value.role
  }
  return 'Software Engineer' // fallback
})

const userAvatar = computed(() => {
  // Default to template avatar
  return '/assets/dist/images/profile-5.jpg'
})

// Methods
const onSearch = () => {
  showSearchResults.value = searchQuery.value.length > 0
}

const toggleMobileSearch = () => {
  // Toggle mobile search functionality
  // console.log('Toggle mobile search')
}

// Dropdown functionality handled by Midone template JS

const navigateTo = (path: string) => {
  router.push(path)
  showSearchResults.value = false
}

const handleLogout = async () => {
  try {
    // Close the user dropdown specifically
    if (userDropdown.value) {
      const dropdownToggle = userDropdown.value.querySelector('.dropdown-toggle')
      if (dropdownToggle) {
        dropdownToggle.setAttribute('aria-expanded', 'false')
      }
    }
    
    if (userDropdownMenu.value) {
      userDropdownMenu.value.classList.remove('show')
      userDropdownMenu.value.style.display = 'none'
    }
    
    // Close any other open dropdowns
    const dropdowns = document.querySelectorAll('.dropdown-toggle[aria-expanded="true"]')
    dropdowns.forEach(dropdown => {
      dropdown.setAttribute('aria-expanded', 'false')
    })
    
    const openMenus = document.querySelectorAll('.dropdown-menu.show')
    openMenus.forEach(menu => {
      menu.classList.remove('show')
      ;(menu as HTMLElement).style.display = 'none'
    })
    
    await authService.logout()
  } catch (error) {
    console.error('Logout failed:', error)
  } finally {
    // Navigate to login after a brief delay
    setTimeout(() => {
      router.push('/login')
    }, 150)
  }
}

const loadCurrentUser = async () => {
  try {
    const response = await authService.me()
    currentUser.value = {
      ...response.user,
      surname: response.user.surname || '',
      role: (response.user.role || '').toLowerCase()
    }
  } catch (error) {
    console.error('Failed to load user:', error)
    // Don't redirect here, let the route guard handle it
  }
}

// Click outside to close search results
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  
  // Check if click is outside search
  if (!target.closest('.search') && !target.closest('.search-result') && showSearchResults.value) {
    showSearchResults.value = false
  }
}

// Lifecycle
onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  
  // Load current user
  await loadCurrentUser()
  
  // Initialize Midone dropdowns after component mount
  setTimeout(() => {
    if (typeof (window as any).feather !== 'undefined') {
      (window as any).feather.replace()
    }
    
    // Initialize dropdown functionality
    if (typeof window !== 'undefined' && (window as any).app) {
      (window as any).app.dropdowns?.init()
    }
  }, 100)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Dropdown hover effects */
.dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

/* Ensure proper positioning */
.dropdown {
  position: relative;
}
</style>
