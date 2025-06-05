<template>
  <div>
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
          <h4>Welcome back, {{ user.firstName || 'User' }}!</h4>
          <div class="row mt-4">
            <div class="col-md-3 mb-3">
              <div class="card text-center clickable" @click="dashboardTab = 'books'">
                <div class="card-body">
                  <i class="fas fa-book fa-2x text-primary mb-2"></i>
                  <h5 class="card-title">{{ ownedBooks.length }}</h5>
                  <p class="card-text">Books Owned</p>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="card text-center clickable" @click="dashboardTab = 'rentals'">
                <div class="card-body">
                  <i class="fas fa-book-reader fa-2x text-success mb-2"></i>
                  <h5 class="card-title">{{ rentedBooks.length }}</h5>
                  <p class="card-text">Books Rented</p>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="card text-center clickable" @click="dashboardTab = 'transactions'">
                <div class="card-body">
                  <i class="fas fa-receipt fa-2x text-info mb-2"></i>
                  <h5 class="card-title">{{ transactionHistory.length }}</h5>
                  <p class="card-text">Total Transactions</p>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="card text-center">
                <div class="card-body">
                  <i class="fas fa-layer-group fa-2x text-warning mb-2"></i>
                  <h5 class="card-title">{{ totalBooks }}</h5>
                  <p class="card-text">Total Books</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- My Books -->
        <div v-else-if="dashboardTab === 'books'">
          <h4>My Books ({{ ownedBooks.length }})</h4>
          <div v-if="ownedBooks.length === 0" class="alert alert-info">No books owned yet.</div>
          <div class="row" v-else>
            <div class="col-md-4 mb-3" v-for="(book, idx) in ownedBooks" :key="book.id">
              <div class="card h-100">
                <img v-if="book.image" :src="book.image" class="card-img-top" style="height:180px;object-fit:cover;">
                <div class="card-body">
                  <h5 class="card-title">{{ book.title }}</h5>
                  <p class="card-text">{{ book.author }}</p>
                  <span class="badge bg-primary">Owned</span>
                  <div class="d-flex align-items-center mt-2">
                    <button class="btn btn-outline-primary btn-sm me-2" @click="viewBook(book)">
                      <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-outline-secondary btn-sm" @click="showCommentModal(book, idx, 'owned')">
                      <i class="fas fa-comment"></i> Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- My Rentals -->
       
        <div v-else-if="dashboardTab === 'rentals'">
  <h4>My Rentals ({{ rentedBooks.length }})</h4>
  <div v-if="rentedBooks.length === 0" class="alert alert-info">No books rented yet.</div>
  <div class="row" v-else>
    <div class="col-md-4 mb-3" v-for="(book, idx) in rentedBooks" :key="book.id">
      <div class="card h-100">
        <img v-if="book.image" :src="book.image" class="card-img-top" style="height:180px;object-fit:cover;">
        <div class="card-body">
          <h5 class="card-title">{{ book.title }}</h5>
          <p class="card-text">{{ book.author }}</p>
             
          <span class="badge bg-success">Rented</span> <span class="btn btn-outline-danger btn-sm" @click="returnRentedBook(idx)" >   <i class="fas fa-undo"></i> Return </span>
          <div class="d-flex align-items-center mt-2">
            <button class="btn btn-outline-primary btn-sm me-2" @click="viewBook(book)">
              <i class="fas fa-eye"></i> Read
            </button>
            <button class="btn btn-outline-secondary btn-sm me-2" @click="showCommentModal(book, idx, 'rented')">
              <i class="fas fa-comment"></i> Comment
            </button>
            
          </div>
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

        <!-- Appointments -->
        <div v-else-if="dashboardTab === 'appointments'">
          <h4>Appointments</h4>
          <button class="btn btn-primary mb-3" @click="showAppointmentModal = true">
            <i class="fas fa-calendar-plus"></i> Create Appointment
          </button>
          <div v-if="appointments.length === 0" class="alert alert-info">No appointments yet.</div>
          <ul class="list-group" v-else>
            <li class="list-group-item" v-for="(app, idx) in appointments" :key="idx">
              <strong>{{ app.subject }}</strong> - {{ app.details }} <span class="text-muted">({{ app.date }})</span>
            </li>
          </ul>
          <!-- Appointment Modal -->
          <div v-if="showAppointmentModal" class="custom-modal-backdrop" @click.self="showAppointmentModal = false">
            <div class="custom-modal">
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
        </div>

        <!-- Settings -->
        <div v-else-if="dashboardTab === 'settings'">
          <h4>Settings</h4>
          <form @submit.prevent="saveSettings" class="mt-3" style="max-width:400px;">
            <div class="mb-3">
              <label class="form-label">First Name</label>
              <input v-model="user.firstName" type="text" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="user.email" type="email" class="form-control" required>
            </div>
            <button class="btn btn-primary" type="submit">Save Changes</button>
          </form>
          <div class="mt-4">
            <h6>Your Details:</h6>
            <p><strong>Name:</strong> {{ user.firstName }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Age:</strong> {{ user.Age }}</p>
            <p><strong>Phone NO:</strong> {{ user.phoneNumber }}</p>
          </div>
        </div>

        <!-- Comment Modal -->
        <div v-if="showComment" class="custom-modal-backdrop" @click.self="closeCommentModal">
          <div class="custom-modal">
            <div class="modal-header">
              <h5 class="modal-title">Add Comment</h5>
              <button type="button" class="btn-close" @click="closeCommentModal"></button>
            </div>
            <div class="modal-body">
              <input v-model="commentText" class="form-control mb-2" placeholder="Type your comment..." />
              <button class="btn btn-success" @click="addCommentToBook">Submit</button>
              <div v-if="currentBook.comments && currentBook.comments.length" class="mt-3">
                <div class="fw-bold">Comments:</div>
                <ul class="list-unstyled mb-0">
                  <li v-for="(c, i) in currentBook.comments" :key="i" class="small">{{ c }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import mockstorage from "@/stores/mockstorage";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  data() {
    return {
      dashboardTab: "overview",
      sidebarItems: [
        { tab: "overview", label: "Overview", icon: "fas fa-chart-bar" },
        { tab: "books", label: "My Books", icon: "fas fa-book" },
        { tab: "rentals", label: "My Rentals", icon: "fas fa-calendar-alt" },
        { tab: "transactions", label: "Transactions", icon: "fas fa-receipt" },
        { tab: "appointments", label: "Appointments", icon: "fas fa-calendar-plus" },
        { tab: "settings", label: "Settings", icon: "fas fa-cog" }
      ],
      user: {},
      ownedBooks: [],
      rentedBooks: [],
      transactionHistory: [],
      appointments: [],
      showComment: false,
      commentText: "",
      currentBook: {},
      currentBookIdx: null,
      currentBookType: "",
      showAppointmentModal: false,
      appointment: { subject: "", details: "" }
    };
  },
  computed: {
    totalBooks() {
      return this.ownedBooks.length + this.rentedBooks.length;
    }
  },
  async mounted() {
    let userId = localStorage.getItem("userId");
    let user = null;
    if (userId) {
      user = await mockstorage.fetchUser(userId);
    }
    if (!user) {
      const users = await mockstorage.fetchUsers();
      user = users[0] || { firstName: "", email: "" };
      if (user.id) localStorage.setItem("userId", user.id);
    }
    this.user = user;
    // Fetch only books and transactions for this user
    this.ownedBooks = await mockstorage.fetchBroughtBooks(user.id);
    this.rentedBooks = await mockstorage.fetchBorrowedBooks(user.id);
    this.transactionHistory = await mockstorage.fetchTransactionHistory(user.id);
    this.appointments = await mockstorage.fetchAppointments(user.id);
  },
  methods: {
    saveSettings() {
      mockstorage.saveUser(this.user);
      toast.success("Profile updated!");
    },
    viewBook(book) {
      window.open(book.fileUrl || "https://www.wps.com/", "_blank");
    },
    showCommentModal(book, idx, type) {
      this.currentBook = book;
      this.currentBookIdx = idx;
      this.currentBookType = type;
      this.commentText = "";
      this.showComment = true;
    },
    closeCommentModal() {
      this.showComment = false;
      this.currentBook = {};
      this.currentBookIdx = null;
      this.currentBookType = "";
      this.commentText = "";
    },


  // ...existing code...
  async returnRentedBook(idx) {
    const book = this.rentedBooks[idx];
    // Remove from local array
    this.rentedBooks.splice(idx, 1);
    // Remove from API (implement this in your mockstorage)
    await mockstorage.removeBorrowedBook(book.id, this.user.id);
    toast.success("Book returned successfully!");
  },

    async addCommentToBook() {
      if (!this.commentText) return;
      if (!this.currentBook.comments) this.currentBook.comments = [];
      this.currentBook.comments.push(this.commentText);

      if (this.currentBookType === "owned") {
        this.ownedBooks.splice(this.currentBookIdx, 1, this.currentBook);
        await mockstorage.saveBookComment(this.currentBook.id, this.currentBook.comments);
      } else if (this.currentBookType === "rented") {
        this.rentedBooks.splice(this.currentBookIdx, 1, this.currentBook);
        await mockstorage.saveBookComment(this.currentBook.id, this.currentBook.comments);
      }
      this.closeCommentModal();
      toast.success("Comment added!");
    },
    async submitAppointment() {
      await mockstorage.saveAppointment({
        ...this.appointment,
        userId: this.user.id,
        date: new Date().toLocaleString()
      });
      toast.success("Appointment created!");
      this.showAppointmentModal = false;
      this.appointment = { subject: "", details: "" };
      this.appointments = await mockstorage.fetchAppointments(this.user.id);
    }
  }
};
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
  width: 250px;
  min-width: 180px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafbfc;
  padding: 10px 0;
  height: fit-content;
}
.displayAside {
  flex: 1;
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
.clickable {
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.clickable:hover {
  box-shadow: 0 2px 12px rgba(13,110,253,0.15);
}

/* Custom Modal Styling */
.custom-modal-backdrop {
  position: fixed;
  z-index: 2000;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.custom-modal {
  background: #fff;
  border-radius: 10px;
  max-width: 400px;
  width: 95vw;
  box-shadow: 0 4px 32px rgba(0,0,0,0.25);
  padding: 24px 18px 18px 18px;
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
    flex: 1 1 0;
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