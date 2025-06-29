<template>
  <div>
    <h4>Appointments</h4>
    <marquee behavior="scroll" direction="Left">If you are facing any issue just reload the page your data are secured</marquee>

    <button class="btn btn-primary mb-3" @click="handleCreateClick">
      <i class="fas fa-calendar-plus"></i> Create Appointment
    </button>
    
    <div v-if="!userData" class="alert alert-warning">
      Please login to manage appointments.
    </div>
    
    <div v-else-if="userAppointments.length === 0" class="alert alert-info">
      No appointments yet.
    </div>
    
    <ul class="list-group" v-else>
      <li class="list-group-item" v-for="app in userAppointments" :key="app.id">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <strong>{{ app.subject }}</strong>
            <p class="mb-1">{{ app.details }}</p>
            <small class="text-muted">
              Scheduled for: {{ formatDate(app.date) }}
            </small>
          </div>
          <span :class="getStatusBadgeClass(app.status)">
            {{ app.status }}
          </span>
        <button 
        class="btn btn-danger btn-sm" 
        @click="deleteAppointment(app.id)"
        :disabled="isLoading"
      >
        <i class="fas fa-trash"></i>
      </button>
        </div>
      </li>
    </ul>
    
    <!-- Appointment Modal -->
    <div v-if="showAppointmentModal" class="custom-modal-backdrop">
      <div class="custom-modal">
        <div class="modal-header">
          <h5 class="modal-title">Create Appointment</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitAppointment">
            <div class="mb-3">
              <label class="form-label">Subject</label>
              <input v-model="appointment.subject" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Details</label>
              <textarea v-model="appointment.details" class="form-control" rows="3" required></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Appointment Date</label>
              <input v-model="appointment.date" type="datetime-local" class="form-control" required />
            </div>
            <button class="btn btn-success" type="submit" :disabled="isLoading">
              {{ isLoading ? 'Creating...' : 'Create Appointment' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify'
import mockstorage from '@/stores/mockstorage'

export default {
  name: 'AppointmentsSection',
  
  data() {
    return {
      showAppointmentModal: false,
      appointment: {
        subject: '',
        details: '',
        date: ''
      },
      isLoading: false,
      userData: null,
      userAppointments: []
    }
  },

  async created() {
    await this.initialize()
  },

  methods: {
    async initialize() {
      try {
        const userData = await mockstorage.getCurrentUser()
        if (userData) {
          this.userData = userData
          await this.loadAppointments()
        }
      } catch (error) {
        console.error('Failed to initialize:', error)
      }
    },

    async loadAppointments() {
      try {
        // Get all appointments from server
        const appointments = await mockstorage.fetchAllAppointments()
        // Filter for current user
        this.userAppointments = appointments.filter(app => app.userId === this.userData.id)
      } catch (error) {
        console.error('Failed to load appointments:', error)
        toast.error('Failed to load appointments')
      }
    },

    
    handleCreateClick() {
      if (!this.userData) {
        toast.warning('Please login to create appointments')
        return
      }
      this.showAppointmentModal = true
    },

    closeModal() {
      this.showAppointmentModal = false
      this.appointment = { subject: '', details: '', date: '' }
    },

    async submitAppointment() {
      if (!this.userData?.id) {
        toast.error('Please login to create appointments')
        return
      }

      this.isLoading = true
      try {
        const newAppointment = {
          subject: this.appointment.subject,
          details: this.appointment.details,
          date: new Date(this.appointment.date).toISOString(),
          status: 'pending'
        }

        // Save appointment using mockstorage service
        const savedAppointment = await mockstorage.saveAppointment(
          this.userData.id, 
          newAppointment
        )

        // Update local state with saved appointment
        this.userAppointments.push(savedAppointment)
        
        // Reset and close
        this.closeModal()
        toast.success('Appointment created successfully!')

        // Refresh appointments to ensure sync
        await this.loadAppointments()
      } catch (error) {
        console.error('Failed to create appointment:', error)
        toast.error('Failed to create appointment')
      } finally {
        this.isLoading = false
      }
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleString()
    },

    getStatusBadgeClass(status) {
      return {
        pending: 'badge bg-warning',
        confirmed: 'badge bg-success',
        cancelled: 'badge bg-danger',
        completed: 'badge bg-info'
      }[status] || 'badge bg-secondary'
    }
  }
}
</script>

<style scoped>
.custom-modal-backdrop {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  position: relative;
}

.btn-close {
  position: absolute;
  right: 1rem;
  top: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body {
  padding: 1rem;
}

.list-group-item {
  margin-bottom: 0.5rem;
}
</style>