<template>
  <div>
    <h3 class="m-3">My Profile</h3>
    <div class="container-fluid conc">
      <!-- Sidebar Component -->
      <DashboardSidebar 
        :active-tab="dashboardTab" 
        @tab-change="dashboardTab = $event" 
      />
      
      <!-- Main Content -->
      <section class="displayAside">
        <!-- Overview -->
        <OverviewSection
          v-if="dashboardTab === 'overview'"
          :user="userData"
          @tab-change="dashboardTab = $event"
        />
        
        <!-- My Books -->
        <BooksSection
          v-else-if="dashboardTab === 'books'"
          :books="userData.broughtBooks || []"
          type="owned"
          :read-books="readBooks"
          :selected-book="selectedBook"
          @view-book="viewBook"
          @show-comment="showCommentModal"
          @download-book="downloadBook"
          @close-reading="closeReadingView"
        />
        
        <!-- My Rentals -->
        <BooksSection
          v-else-if="dashboardTab === 'rentals'"
          :books="userData.borrowedBooks || []"
          type="rented"
          :read-books="readBooks"
          :selected-book="selectedBook"
          :countdown-displays="countdownDisplays"
          @view-book="viewBook"
          @show-comment="showCommentModal"
          @return-book="returnRentedBook"
          @close-reading="closeReadingView"
        />
        
        <!-- Transactions -->
        <TransactionsSection
          v-else-if="dashboardTab === 'transactions'"
          :transaction-history="userData.transactionHistory || []"
        />
        
        <!-- Appointments -->
        <AppointmentsSection
          v-else-if="dashboardTab === 'appointments'"
          :appointments="userData.appointments || []"
          @appointment-created="handleAppointmentCreated"
        />
        
        <!-- Settings -->
        <SettingsSection
          v-else-if="dashboardTab === 'settings'"
          :user="userData"
          :user-comments="userData.comments || []"
          :settings-loading="settingsLoading"
          @save-settings="saveSettings"
          @update-user="updateUserData"
        />
        
        <!-- Comment Modal -->
        <div v-if="showComment" class="custom-modal-backdrop" @click.self="closeCommentModal">
          <div class="custom-modal">
            <div class="modal-header">
              <h5 class="modal-title">Add Comment for {{ currentBook.title }}</h5>
              <button type="button" class="btn-close" @click="closeCommentModal"></button>
            </div>
            <div class="modal-body">
              <input
                v-model="commentText"
                class="form-control mb-2"
                placeholder="Type your comment..."
              />
              <button class="btn btn-success" @click="addCommentToBook" :disabled="commentLoading">
                <span v-if="commentLoading" class="spinner-border spinner-border-sm"></span>
                <span v-else>Submit</span>
              </button>
              <div v-if="currentBookComments.length" class="mt-3">
                <div class="fw-bold">Comments:</div>
                <ul class="list-unstyled mb-0">
                  <li v-for="(c, i) in currentBookComments" :key="i" class="small">{{ c.text }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    
    <footer
      class="text-white text-center footer"
      style="background-color: #2c3e50; padding: 40px 0px"
    >
      <div class="container">
        <p class="mb-0">© 2025 Library Management System. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import DashboardSidebar from '@/components/sidebar.vue'
import OverviewSection from '@/components/overview.vue'
import BooksSection from '@/components/mybook.vue'
import TransactionsSection from '@/components/mytransavtion.vue'
import AppointmentsSection from '@/components/appiontment.vue'
import SettingsSection from '@/components/setting.vue'
import mockstorage from '@/stores/mockstorage'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default {
  name: 'UserDashboard',
  components: {
    DashboardSidebar,
    OverviewSection,
    BooksSection,
    TransactionsSection,
    AppointmentsSection,
    SettingsSection
  },
  
  data() {
    return {
      dashboardTab: 'overview',
      userData: {
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        age: "",
        phoneNumber: "",
        role: "user",
        appointments: [],
        borrowedBooks: [],
        broughtBooks: [],
        comments: [],
        transactionHistory: []
      },
      showComment: false,
      commentText: '',
      currentBook: {},
      currentBookIdx: null,
      currentBookType: '',
      commentLoading: false,
      settingsLoading: false,
      selectedBook: null,
      countdownTimers: {},
      countdownDisplays: {},
      readBooks: new Set(),
    }
  },

  computed: {
    currentBookComments() {
      const bookId = this.currentBook.bookId || this.currentBook.id
      return this.userData.comments?.filter(comment => comment.bookId === bookId) || []
    }
  },

  async mounted() {
    await this.loadUserData()
    this.setupRentalTimers()
    
    // Listen for user data updates
    window.addEventListener('user-data-updated', this.handleUserDataUpdate)
  },

  beforeUnmount() {
    Object.values(this.countdownTimers).forEach(clearInterval)
    window.removeEventListener('user-data-updated', this.handleUserDataUpdate)
  },

  methods: {
    async loadUserData() {
      try {
        // Get user data from session storage
        const userDataStr = sessionStorage.getItem('userData')
        if (!userDataStr) {
          toast.error('Please login to view profile')
          this.$router.push('/')
          return
        }

        const sessionUserData = JSON.parse(userDataStr)
        
        // Fetch fresh data from server
        const freshUserData = await mockstorage.fetchUser(sessionUserData.id)
        if (freshUserData) {
          this.userData = freshUserData
          // Update session storage with fresh data
          sessionStorage.setItem('userData', JSON.stringify(freshUserData))
        } else {
          this.userData = sessionUserData
        }

        // Load read books from session storage
        const readBooksKey = `readBooks_${this.userData.id}`
        const readBooks = JSON.parse(sessionStorage.getItem(readBooksKey) || '[]')
        this.readBooks = new Set(readBooks)

        toast.success('Profile data loaded successfully!')
      } catch (error) {
        console.error('Error loading user data:', error)
        toast.error('Failed to load user data')
      }
    },

    handleUserDataUpdate(event) {
      if (event.detail) {
        this.userData = event.detail
        sessionStorage.setItem('userData', JSON.stringify(event.detail))
      }
    },

    setupRentalTimers() {
      this.userData.borrowedBooks?.forEach((book, idx) => {
        if (book.borrowDate) {
          this.scheduleAutoReturn(book, idx)
        }
      })
    },

    async saveSettings() {
      this.settingsLoading = true
      try {
        const updatedUser = await mockstorage.updateUser(this.userData.id, this.userData)
        this.userData = updatedUser
        sessionStorage.setItem('userData', JSON.stringify(updatedUser))
        toast.success('Profile updated successfully!')
      } catch (error) {
        console.error('Error saving settings:', error)
        toast.error('Failed to save settings.')
      } finally {
        this.settingsLoading = false
      }
    },

    updateUserData(newUserData) {
      this.userData = { ...this.userData, ...newUserData }
    },

    viewBook(book) {
      this.selectedBook = book
      const bookId = book.bookId || book.id
      this.readBooks.add(bookId)
      sessionStorage.setItem(`readBooks_${this.userData.id}`, JSON.stringify([...this.readBooks]))
      toast.success(`Opened ${book.title} for reading`)
    },

    closeReadingView() {
      this.selectedBook = null
      toast.success('Closed reading view')
    },

    downloadBook(book) {
      if (!book.pdfUrl) {
        toast.error('No PDF available for this book.')
        return
      }
      const link = document.createElement('a')
      link.href = book.pdfUrl
      link.download = `${book.title}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success(`Downloading ${book.title}`)
    },

    showCommentModal({ book, idx, type }) {
      this.currentBook = { ...book }
      this.currentBookIdx = idx
      this.currentBookType = type
      this.commentText = ''
      this.showComment = true
      toast.info(`Opened comment modal for ${book.title}`)
    },

    closeCommentModal() {
      this.showComment = false
      this.currentBook = {}
      this.currentBookIdx = null
      this.currentBookType = ''
      this.commentText = ''
      toast.info('Closed comment modal')
    },

    async addCommentToBook() {
      if (!this.commentText) {
        toast.error('Comment cannot be empty.')
        return
      }
      
      this.commentLoading = true
      try {
        const bookId = this.currentBook.bookId || this.currentBook.id
        await mockstorage.saveComment(this.userData.id, bookId, this.commentText)
        
        // Refresh user data to get updated comments
        await this.loadUserData()
        
        toast.success('Comment added successfully!')
        this.closeCommentModal()
      } catch (error) {
        console.error('Error adding comment:', error)
        toast.error('Failed to add comment.')
      } finally {
        this.commentLoading = false
      }
    },

    async returnRentedBook({ bookId, idx }) {
      try {
        const bookToReturn = this.userData.borrowedBooks.find((book) => (book.bookId || book.id) === bookId)
        if (!bookToReturn) {
          toast.error('Book not found in rented books.')
          return
        }

        // Remove from borrowed books
        this.userData.borrowedBooks.splice(idx, 1)
        
        // Clear countdown timer
        clearInterval(this.countdownTimers[`interval_${bookId}`])
        delete this.countdownTimers[`interval_${bookId}`]
        delete this.countdownDisplays[bookId]

        // Update user data on server
        await mockstorage.updateUser(this.userData.id, this.userData)
        
        toast.success('Book returned successfully!')
      } catch (error) {
        console.error('Error returning book:', error)
        toast.error('Failed to return book.')
      }
    },

    async handleAppointmentCreated(newApp) {
      try {
        await mockstorage.saveAppointment(this.userData.id, newApp)
        // Refresh user data to get updated appointments
        await this.loadUserData()
        toast.success('Appointment created successfully!')
      } catch (error) {
        console.error('Error creating appointment:', error)
        toast.error('Failed to create appointment.')
      }
    },

    scheduleAutoReturn(book, idx) {
      const bookId = book.bookId || book.id
      if (!book.borrowDate) {
        book.borrowDate = new Date().toISOString()
      }

      const borrowDate = new Date(book.borrowDate)
      const returnDate = new Date(borrowDate.getTime() + 14 * 24 * 60 * 60 * 1000)
      const now = new Date()
      const timeUntilReturn = returnDate.getTime() - now.getTime()

      if (timeUntilReturn > 0) {
        if (this.countdownTimers[bookId]) clearTimeout(this.countdownTimers[bookId])
        this.countdownTimers[bookId] = setTimeout(() => {
          const idxNow = this.userData.borrowedBooks.findIndex((b) => (b.bookId || b.id) === bookId)
          if (idxNow !== -1) {
            this.returnRentedBook({ bookId, idx: idxNow })
            toast.info(`Book "${book.title}" auto-returned after 2 weeks`)
          }
        }, timeUntilReturn)
      }

      this.startCountdown(bookId)
    },

    startCountdown(bookId) {
      if (this.countdownTimers[`interval_${bookId}`])
        clearInterval(this.countdownTimers[`interval_${bookId}`])

      this.countdownTimers[`interval_${bookId}`] = setInterval(() => {
        this.updateCountdown(bookId)
      }, 1000)

      this.updateCountdown(bookId)
    },

    updateCountdown(bookId) {
      const book = this.userData.borrowedBooks?.find((b) => (b.bookId || b.id) === bookId)
      if (!book || !book.borrowDate) {
        clearInterval(this.countdownTimers[`interval_${bookId}`])
        delete this.countdownTimers[`interval_${bookId}`]
        this.countdownDisplays[bookId] = 'No timer'
        return
      }

      const borrowDate = new Date(book.borrowDate)
      const returnDate = new Date(borrowDate.getTime() + 14 * 24 * 60 * 60 * 1000)
      const now = new Date()
      const timeLeft = returnDate.getTime() - now.getTime()

      if (timeLeft <= 0) {
        this.countdownDisplays[bookId] = "Time's up!"
        clearInterval(this.countdownTimers[`interval_${bookId}`])
        delete this.countdownTimers[`interval_${bookId}`]
        return
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

      this.countdownDisplays[bookId] = `${days}d ${hours}h ${minutes}m ${seconds}s`
    }
  }
}
</script>

<style scoped>
.conc {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  gap: 20px;
}

.displayAside {
  flex: 1;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
  padding: 24px;
  min-height: 300px;
}

.custom-modal-backdrop {
  position: fixed;
  z-index: 1000;
  top: 0;
  height: 100vh;
  left: 0;
  right: 0;
  bottom: rgba(0, 0, 0, 0.4);
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-modal {
  background: #fff;
  border-radius: 10px;
  max-width: 400px;
  width: 95vw;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.25);
  padding: 18px 24px;
  position: relative;
  z-index: 2100;
}

.btn-close {
  border: none;
  background: transparent;
  font-size: 1.5rem;
  position: absolute;
  right: 12px;
  top: 12px;
  cursor: pointer;
}

@media (max-width: 900px) {
  .conc {
    flex-direction: column;
    gap: 0;
  }
  .displayAside {
    width: 100%;
    min-height: 100px;
    border-radius: 0 0 8px 8px;
  }
}
</style>
