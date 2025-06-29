<template>
  <div class="admin-dashboard">
    <!-- Navigation Component -->
    <AdminNavigation 
      :active-tab="adminTab" 
      :loading-tab="loadingTab"
      @tab-changed="changeTab"
    />
    
    <main class="container-fluid pt-5 mt-4">
      <section class="py-4">
        <!-- Overview Section -->
        <AdminOverview 
          v-if="adminTab === 'overview'"
          :books="books"
          :users="users"
          :appointments="appointments"
          :transactions="transactions"
          :comments="comments"
          :admin-profile="adminProfile"
        />
        
        <!-- Management Sections -->
        <AdminManagement
          v-else-if="['books', 'users', 'transactions'].includes(adminTab)"
          :active-section="adminTab"
          :books="books"
          :users="users"
          :transactions="transactions"
          @add-book="handleAddBook"
          @update-book="handleUpdateBook"
          @delete-book="handleDeleteBook"
          @delete-user="handleDeleteUser"
        />
        
        <!-- Admin Profile -->
        <div v-else-if="adminTab === 'profile'">
          <nav class="profile-navbar mb-3">
            <button
              class="btn btn-outline-primary me-2 my-4"
              :class="{ active: profileTab === 'details' }"
              @click="profileTab = 'details'"
            >
              Details
            </button>
            <button
              class="btn btn-outline-primary me-2 my-4"
              :class="{ active: profileTab === 'edit' }"
              @click="profileTab = 'edit'"
            >
              Edit Profile
            </button>
            <button class="btn btn-outline-danger my-4" @click="logout">Logout</button>
          </nav>
          
          <div v-if="profileTab === 'details'">
            <h4>Admin Details</h4>
            <p><strong>Name:</strong> {{ adminProfile.name }}</p>
            <p><strong>Email:</strong> {{ adminProfile.email }}</p>
            
            <h5 class="mt-4">Recent Comments</h5>
            <ul class="list-group" style="max-height: 300px; overflow-y: auto;">
              <li v-for="c in comments.slice(0, 10)" :key="c.id" class="list-group-item">
                <strong>{{ getUserName(c.userId) }}:</strong> {{ c.text }}
                <small class="text-muted d-block">{{ formatDate(c.createdAt) }}</small>
              </li>
              <li v-if="comments.length === 0" class="list-group-item text-muted">
                No comments found.
              </li>
            </ul>
          </div>
          
          <div v-else-if="profileTab === 'edit'">
            <h4>Edit Profile</h4>
            <form @submit.prevent="saveAdminProfile" style="max-width: 400px">
              <div class="mb-3">
                <label class="form-label">Full Name</label>
                <input v-model="adminProfile.name" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="adminProfile.email" type="email" class="form-control" required />
              </div>
              <button class="btn btn-primary" type="submit" :disabled="profileLoading">
                <span v-if="profileLoading" class="spinner-border spinner-border-sm"></span>
                <span v-else>Save Changes</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
    
    <footer class="footer text-white text-center mt-auto py-4 bg-dark">
      <div class="container">
        <p class="mb-0">© 2025 Library Management System. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import AdminNavigation from '@/components/AdminNavigation.vue'
import AdminOverview from '@/components/AdminOverview.vue'
import AdminManagement from '@/components/AdminManagement.vue'
import mockstorage from '@/stores/mockstorage'

export default {
  name: 'AdminDashboard',
  components: {
    AdminNavigation,
    AdminOverview,
    AdminManagement
  },
  
  data() {
    return {
      adminTab: 'overview',
      profileTab: 'details',
      loadingTab: '',
      profileLoading: false,
      
      // Data arrays
      books: [],
      users: [],
      appointments: [],
      transactions: [],
      comments: [],
      
      // Admin profile
      adminProfile: {
        name: 'Sam akinbode',
        email: 'akinbodetomiwa04@gmail.com'
      }
    }
  },

  async mounted() {
    await this.fetchAllData()
    this.loadAdminProfile()
  },

  methods: {
    async fetchAllData() {
      try {
        // Show loading state
        this.showToast('Loading admin data...')
        
        // Fetch all data using the API service
        const [books, users, appointments, transactions, comments] = await Promise.all([
          mockstorage.fetchAllBooks(),
          mockstorage.fetchUsers(),
          mockstorage.fetchAllAppointments(),
          mockstorage.fetchAllTransactions(),
          mockstorage.fetchAllComments()
        ])
        
        this.books = books || []
        this.users = users || []
        this.appointments = appointments || []
        this.transactions = transactions || []
        this.comments = comments || []
        
        this.showToast('Admin data loaded successfully!')
      } catch (error) {
        console.error('Failed to fetch admin data:', error)
        this.showToast('Failed to load some data. Please refresh the page.', true)
      }
    },

    changeTab(tab) {
      if (this.loadingTab) return
      this.loadingTab = tab
      
      setTimeout(() => {
        this.adminTab = tab
        this.loadingTab = ''
        sessionStorage.setItem('adminLastSeen', new Date().toISOString())
      }, 300)
    },

    loadAdminProfile() {
      const saved = sessionStorage.getItem('adminProfile')
      if (saved) {
        try {
          this.adminProfile = JSON.parse(saved)
        } catch (error) {
          console.warn('Failed to load admin profile from session storage')
        }
      }
    },

    async saveAdminProfile() {
      this.profileLoading = true
      try {
        sessionStorage.setItem('adminProfile', JSON.stringify(this.adminProfile))
        this.showToast('Admin profile updated!')
        this.profileTab = 'details'
      } catch (error) {
        this.showToast('Failed to update profile', true)
      } finally {
        this.profileLoading = false
      }
    },

    // Book management handlers
    async handleAddBook(bookData) {
      try {
        const newBook = await mockstorage.addBook(bookData)
        this.books.unshift(newBook)
        this.showToast('Book added successfully!')
      } catch (error) {
        console.error('Failed to add book:', error)
        this.showToast('Failed to add book!', true)
      }
    },

    async handleUpdateBook(bookData) {
      try {
        const updatedBook = await mockstorage.updateBook(bookData.id, bookData)
        const index = this.books.findIndex(b => b.id === bookData.id)
        if (index !== -1) {
          this.books.splice(index, 1, updatedBook)
        }
        this.showToast('Book updated successfully!')
      } catch (error) {
        console.error('Failed to update book:', error)
        this.showToast('Failed to update book!', true)
      }
    },

    async handleDeleteBook(bookId) {
      try {
        await mockstorage.deleteBook(bookId)
        this.books = this.books.filter(b => b.id !== bookId)
        this.showToast('Book deleted successfully!')
      } catch (error) {
        console.error('Failed to delete book:', error)
        this.showToast('Failed to delete book!', true)
      }
    },

    async handleDeleteUser(userId) {
      try {
        await mockstorage.deleteUser(userId)
        this.users = this.users.filter(u => u.id !== userId)
        this.showToast('User deleted successfully!')
      } catch (error) {
        console.error('Failed to delete user:', error)
        this.showToast('Failed to delete user!', true)
      }
    },

    logout() {
      mockstorage.logout()
      this.$router.push('/')
    },

    // Utility methods
    getUserName(userId) {
      const user = this.users.find(u => u.id === userId)
      return user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : `User ${userId}`
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    showToast(message, error = false) {
      const toast = document.createElement('div')
      toast.textContent = message
      toast.style.position = 'fixed'
      toast.style.top = '20px'
      toast.style.right = '30px'
      toast.style.background = error ? '#dc3545' : '#28a745'
      toast.style.color = '#fff'
      toast.style.padding = '12px 24px'
      toast.style.borderRadius = '6px'
      toast.style.zIndex = 9999
      toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'
      document.body.appendChild(toast)
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 3000)
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.profile-navbar {
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
}

.footer {
  background: #222;
  color: #fff;
  font-size: 1rem;
  margin-top: auto;
}

@media (max-width: 900px) {
  .container-fluid {
    padding-bottom: 80px;
  }
}

@media (max-width: 600px) {
  .footer {
    font-size: 0.9rem;
    padding: 20px 0;
  }
}
</style>
