<template>
  <h3 class="m-3">My Profile</h3>
  <div class="container-fluid conc">
    <!-- Sidebar -->
    <aside class="asideBar">
      <div
        v-for="item in sidebarItems"
        :key="item.tab"
        @click="dashboardTab = item.tab"
        class="sidebar-item"
        :class="{ active: dashboardTab === item.tab }"
      >
        <i :class="item.icon"></i>
        <span class="sidebar-label">{{ item.label }}</span>
      </div>
    </aside>

    <!-- Main Content -->
    <section class="displayAside">
      <!-- Overview -->
      <div v-if="dashboardTab === 'overview'">
        <h4>Welcome back, {{ user.name || 'User' }}!</h4>
        <div class="row mt-4">
          <div class="col-md-4 mb-3">
            <div class="card text-center">
              <div class="card-body">
                <i class="fas fa-book fa-2x text-primary mb-2"></i>
                <h5 class="card-title">{{ ownedBooks.length }}</h5>
                <p class="card-text">Books Owned</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-3">
            <div class="card text-center">
              <div class="card-body">
                <i class="fas fa-book-reader fa-2x text-success mb-2"></i>
                <h5 class="card-title">{{ rentedBooks.length }}</h5>
                <p class="card-text">Books Rented</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-3">
            <div class="card text-center">
              <div class="card-body">
                <i class="fas fa-receipt fa-2x text-info mb-2"></i>
                <h5 class="card-title">{{ transactionHistory.length }}</h5>
                <p class="card-text">Total Transactions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- My Books -->
      <div v-else-if="dashboardTab === 'books'">
        <h4>My Books</h4>
        <div v-if="ownedBooks.length === 0" class="alert alert-info">No books owned yet.</div>
        <div class="row" v-else>
          <div class="col-md-4 mb-3" v-for="book in ownedBooks" :key="book.id">
            <div class="card h-100">
              <img v-if="book.image" :src="book.image" class="card-img-top" style="height:180px;object-fit:cover;">
              <div class="card-body">
                <h5 class="card-title">{{ book.title }}</h5>
                <p class="card-text">{{ book.author }}</p>
                <span class="badge bg-primary">Owned</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- My Rentals -->
      <div v-else-if="dashboardTab === 'rentals'">
        <h4>My Rentals</h4>
        <div v-if="rentedBooks.length === 0" class="alert alert-info">No books rented yet.</div>
        <div class="row" v-else>
          <div class="col-md-4 mb-3" v-for="book in rentedBooks" :key="book.id">
            <div class="card h-100">
              <img v-if="book.image" :src="book.image" class="card-img-top" style="height:180px;object-fit:cover;">
              <div class="card-body">
                <h5 class="card-title">{{ book.title }}</h5>
                <p class="card-text">{{ book.author }}</p>
                <span class="badge bg-success">Rented</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Transactions -->
      <div v-else-if="dashboardTab === 'transactions'">
        <h4>Transaction History</h4>
        <div v-if="transactionHistory.length === 0" class="alert alert-info">No transactions yet.</div>
        <div class="table-responsive" v-else>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Book</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(tx, idx) in transactionHistory" :key="idx">
                <td>{{ tx.title }}</td>
                <td class="text-capitalize">{{ tx.type }}</td>
                <td>₦{{ tx.price }}</td>
                <td>{{ tx.date }}</td>
                <td>{{ tx.reference }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Appointments & Post Book -->
      <div v-else-if="dashboardTab === 'appointments'">
        <h4>Appointments & Post Your Book</h4>
        <button class="btn btn-primary mb-3" @click="showAppointmentModal = true">
          <i class="fas fa-calendar-plus"></i> Create Appointment
        </button>
        <button class="btn btn-info mb-3 ms-2" @click="showPostBookModal = true">
          <i class="fas fa-upload"></i> Post Your Book (₦500)
        </button>
        <!-- Appointment Modal -->
        <div v-if="showAppointmentModal" class="modal fade show" style="display:block;" @click.self="showAppointmentModal = false">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Create Appointment</h5>
                <button type="button" class="btn-close" @click="showAppointmentModal = false"></button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="submitAppointment">
                  <div class="mb-3">
                    <label class="form-label">Subject</label>
                    <input v-model="appointment.subject" type="text" class="form-control" required>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Details</label>
                    <textarea v-model="appointment.details" class="form-control" required></textarea>
                  </div>
                  <button class="btn btn-success" type="submit">Send</button>
                </form>
              </div>
            </div>
          </div>
          <div class="modal-backdrop fade show"></div>
        </div>
        <!-- Post Book Modal -->
        <div v-if="showPostBookModal" class="modal fade show" style="display:block;" @click.self="showPostBookModal = false">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Post Your Book (₦500)</h5>
                <button type="button" class="btn-close" @click="showPostBookModal = false"></button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="submitPostBook">
                  <div class="mb-3">
                    <label class="form-label">Book Title</label>
                    <input v-model="postBook.title" type="text" class="form-control" required>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Author</label>
                    <input v-model="postBook.author" type="text" class="form-control" required>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Description</label>
                    <textarea v-model="postBook.description" class="form-control" required></textarea>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Contact Info</label>
                    <input v-model="postBook.contact" type="text" class="form-control" required>
                  </div>
                  <button class="btn btn-success" type="submit">Pay & Post</button>
                </form>
              </div>
            </div>
          </div>
          <div class="modal-backdrop fade show"></div>
        </div>
      </div>

      <!-- Settings -->
      <div v-else-if="dashboardTab === 'settings'">
        <h4>Settings</h4>
        <form @submit.prevent="saveSettings" class="mt-3" style="max-width:400px;">
          <div class="mb-3">
            <label class="form-label">Name</label>
            <input v-model="user.name" type="text" class="form-control" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input v-model="user.email" type="email" class="form-control" required>
          </div>
          <button class="btn btn-primary" type="submit">Save Changes</button>
        </form>
        <div class="mt-4">
          <h6>Your Details:</h6>
          <p><strong>Name:</strong> {{ user.name }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dashboardTab: 'overview',
      sidebarItems: [
        { tab: 'overview', label: 'Overview', icon: 'fas fa-chart-bar' },
        { tab: 'books', label: 'My Books', icon: 'fas fa-book' },
        { tab: 'rentals', label: 'My Rentals', icon: 'fas fa-calendar-alt' },
        { tab: 'transactions', label: 'Transactions', icon: 'fas fa-receipt' },
        { tab: 'appointments', label: 'Appointments', icon: 'fas fa-calendar-plus' },
        { tab: 'settings', label: 'Settings', icon: 'fas fa-cog' },
      ],
      user: JSON.parse(localStorage.getItem('user')) || { name: '', email: '' },
      ownedBooks: JSON.parse(localStorage.getItem('broughtBooks')) || [],
      rentedBooks: JSON.parse(localStorage.getItem('borrowedBooks')) || [],
      transactionHistory: JSON.parse(localStorage.getItem('transactionHistory')) || [],
      showAppointmentModal: false,
      showPostBookModal: false,
      appointment: { subject: '', details: '' },
      postBook: { title: '', author: '', description: '', contact: '' }
    }
  },
  methods: {
    saveSettings() {
      localStorage.setItem('user', JSON.stringify(this.user));
      alert('Profile updated!');
    },
    submitAppointment() {
      // Here you would send appointment to your backend or admin
      alert('Appointment request sent!');
      this.showAppointmentModal = false;
      this.appointment = { subject: '', details: '' };
    },
    submitPostBook() {
      // Here you would handle payment and send book details to admin
      alert('Book post request sent! Please proceed with payment of ₦500.');
      this.showPostBookModal = false;
      this.postBook = { title: '', author: '', description: '', contact: '' };
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
.asideBar {
  width: 24%;
  min-width: 180px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafbfc;
  padding: 10px 0;
  height: fit-content;
  transition: width 0.2s;
}
.displayAside {
  width: 73%;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
  padding: 24px;
  min-height: 300px;
}
.sidebar-item {
  margin: 10px 16px;
  padding: 12px 10px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
}
.sidebar-item.active,
.sidebar-item:hover {
  background: #0d6efd;
  color: #fff;
}
.sidebar-item i {
  min-width: 20px;
  font-size: 1.1rem;
}
.sidebar-label {
  display: inline;
  transition: all 0.2s;
}

/* Responsive styles */
@media (max-width: 900px) {
  .conc {
    flex-direction: column;
    gap: 0;
  }
  .asideBar {
    width: 100%;
    min-width: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: stretch;
    padding: 0;
    border-radius: 0;
    border-right: none;
    border-bottom: 1px solid #eee;
    background: #fafbfc;
  }
  .sidebar-item {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 10px 0 4px 0;
    gap: 0;
    border-radius: 0;
    font-size: 0.95rem;
    width: 100%;
    min-width: 0;
  }
  .sidebar-label {
    display: none;
    font-size: 0.8rem;
    margin-top: 3px;
    text-align: center;
  }
  .displayAside {
    width: 100%;
    min-height: 200px;
    border-radius: 0 0 8px 8px;
  }
}
</style>