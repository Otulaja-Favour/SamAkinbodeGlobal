<template>
  <div>
    <h3 class="mb-4 my-4">Welcome, {{ adminProfile.name }}!</h3>
    
    <!-- Statistics Cards -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-md-3" v-for="stat in overviewStats" :key="stat.label">
        <div class="card text-center h-100 border-0 shadow-sm">
          <div class="card-body">
            <i :class="stat.icon" :style="{ color: stat.color }" class="fa-2x mb-2"></i>
            <h5 class="card-title mb-0">{{ stat.value }}</h5>
            <p class="card-text small text-muted">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activities -->
    <h5 class="mb-3">Recent Activities</h5>
    <ul class="list-group overflow-auto" style="max-height: 230px">
      <li class="list-group-item" v-for="(activity, idx) in recentActivities" :key="idx">
        {{ activity }}
      </li>
      <li v-if="recentActivities.length === 0" class="list-group-item text-muted">
        No recent activities.
      </li>
    </ul>

    <!-- New Updates Modal -->
    <div v-if="showNewInfoModal" class="modal-backdrop-custom">
      <div class="modal-custom">
        <div class="modal-header">
          <h5 class="modal-title">New Updates Since Last Login</h5>
          <button type="button" class="btn-close" @click="showNewInfoModal = false"></button>
        </div>
        <div class="modal-body">
          <div v-if="newInfoSummary.users.length">
            <h6>New Users</h6>
            <ul>
              <li v-for="u in newInfoSummary.users" :key="u.id">
                {{ u.firstname }} {{ u.lastname }}
              </li>
            </ul>
          </div>
          <div v-if="newInfoSummary.appointments.length">
            <h6>New Appointments</h6>
            <ul>
              <li v-for="a in newInfoSummary.appointments" :key="a.id">
                {{ getUserName(a.userId) }}: {{ a.subject }} - {{ a.details }} ({{ formatDate(a.date) }})
              </li>
            </ul>
          </div>
          <div v-if="newInfoSummary.transactions.length">
            <h6>New Transactions</h6>
            <ul>
              <li v-for="t in newInfoSummary.transactions" :key="t.id">
                {{ t.title }} - ₦{{ t.amount }} ({{ t.type }})
              </li>
            </ul>
          </div>
          <div v-if="newInfoSummary.comments.length">
            <h6>New Comments</h6>
            <ul>
              <li v-for="c in newInfoSummary.comments" :key="c.id">
                {{ getUserName(c.userId) }}: {{ c.text }} ({{ formatDate(c.date) }})
              </li>
            </ul>
          </div>
          <div v-if="!hasNewUpdates">
            <p>No new updates.</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="showNewInfoModal = false">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminOverview',
  props: {
    books: { type: Array, default: () => [] },
    users: { type: Array, default: () => [] },
    appointments: { type: Array, default: () => [] },
    transactions: { type: Array, default: () => [] },
    comments: { type: Array, default: () => [] },
    adminProfile: { type: Object, default: () => ({ name: 'Admin', email: '' }) }
  },
  data() {
    return {
      showNewInfoModal: false,
      newInfoSummary: {
        users: [],
        appointments: [],
        transactions: [],
        comments: []
      }
    }
  },
  computed: {
    overviewStats() {
      return [
        { label: 'Total Books', value: this.books.length, icon: 'fas fa-book', color: '#0d6efd' },
        { label: 'Total Users', value: this.users.length, icon: 'fas fa-users', color: '#198754' },
        { label: 'Total Appointments', value: this.appointments.length, icon: 'fas fa-calendar-alt', color: '#ffc107' },
        { label: 'Total Transactions', value: this.transactions.length, icon: 'fas fa-receipt', color: '#0dcaf0' }
      ]
    },
    recentActivities() {
      let activities = []
      
      // Add recent transactions
      this.transactions.slice(0, 3).forEach(tx => {
        if (tx && typeof tx === 'object') {
          const userName = this.getUserName(tx.userId) || 'Unknown User'
          const txType = tx.type || 'Transaction'
          const txTitle = tx.title || tx.bookTitle || 'Unknown Item'
          const txAmount = tx.amount || tx.price || 0
          
          activities.push({
            type: 'Transaction',
            detail: `${txType} - ${txTitle} (₦${txAmount}) by ${userName}`,
            date: tx.date || tx.createdAt || new Date().toISOString()
          })
        }
      })
      
      // Add recent appointments
      this.appointments.slice(0, 2).forEach(app => {
        if (app && typeof app === 'object') {
          const userName = this.getUserName(app.userId) || 'Unknown User'
          const subject = app.subject || 'Appointment'
          
          activities.push({
            type: 'Appointment',
            detail: `${subject} by ${userName}`,
            date: app.date || app.createdAt || new Date().toISOString()
          })
        }
      })
      
      // Add recent comments
      this.comments.slice(0, 2).forEach(comment => {
        if (comment && typeof comment === 'object') {
          const userName = this.getUserName(comment.userId) || 'Unknown User'
          const commentText = comment.text || comment.content || 'New comment'
          
          activities.push({
            type: 'Comment',
            detail: `Comment by ${userName}: ${commentText.substring(0, 50)}${commentText.length > 50 ? '...' : ''}`,
            date: comment.date || comment.createdAt || new Date().toISOString()
          })
        }
      })
      
      // Sort by date and return formatted strings
      activities.sort((a, b) => new Date(b.date) - new Date(a.date))
      return activities.slice(0, 5).map(a => `[${a.type}] ${a.detail} (${this.formatDate(a.date)})`)
    },
    hasNewUpdates() {
      return this.newInfoSummary.users.length > 0 ||
             this.newInfoSummary.appointments.length > 0 ||
             this.newInfoSummary.transactions.length > 0 ||
             this.newInfoSummary.comments.length > 0
    }
  },
  mounted() {
    this.checkForNewUpdates()
  },
  methods: {
    getUserName(userId) {
      if (!userId) return 'Unknown User'
      
      const user = this.users.find(u => u && u.id === userId)
      if (!user) return `User #${userId}`
      
      const firstName = user.firstname || user.firstName || ''
      const lastName = user.lastname || user.lastName || ''
      const fullName = `${firstName} ${lastName}`.trim()
      
      return fullName || user.email || user.username || `User #${userId}`
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      
      try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return 'Invalid Date'
        
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch (error) {
        console.warn('Date formatting error:', error)
        return 'Invalid Date'
      }
    },
    checkForNewUpdates() {
      try {
        const lastSeen = sessionStorage.getItem('adminLastSeen')
        const lastSeenTime = lastSeen ? new Date(lastSeen) : new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
        
        // Check for new items since last seen - with safe array handling
        this.newInfoSummary.users = (this.users || []).filter(u => 
          u && u.createdAt && new Date(u.createdAt) > lastSeenTime
        )
        
        this.newInfoSummary.appointments = (this.appointments || []).filter(a => 
          a && a.date && new Date(a.date) > lastSeenTime
        )
        
        this.newInfoSummary.transactions = (this.transactions || []).filter(t => 
          t && (t.date || t.createdAt) && new Date(t.date || t.createdAt) > lastSeenTime
        )
        
        this.newInfoSummary.comments = (this.comments || []).filter(c => 
          c && (c.date || c.createdAt) && new Date(c.date || c.createdAt) > lastSeenTime
        )
        
        // Show modal if there are new updates
        if (this.hasNewUpdates) {
          this.showNewInfoModal = true
        }
        
        // Update last seen time
        sessionStorage.setItem('adminLastSeen', new Date().toISOString())
      } catch (error) {
        console.error('Error checking for new updates:', error)
      }
    }
  }
}
</script>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-custom {
  background: #fff;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 1rem;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
}

.btn-close {
  border: none;
  background: none;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
