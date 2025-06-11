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
              <div class="card h-100 position-relative">
                <i v-if="isBookRead(book.id)" class="fas fa-check-circle text-success position-absolute top-0 end-0 m-2"></i>
                <img v-if="book.image" :src="book.image" class="card-img-top" style="height:180px;object-fit:cover;">
                <div class="card-body">
                  <h5 class="card-title">{{ book.title }}</h5>
                  <p class="card-text">{{ book.author }}</p>
                  <span class="badge bg-primary">Owned</span>
                  <div class="d-flex align-items-center mt-2 gap-2">
                    <button class="btn btn-outline-primary btn-sm" @click="viewBook(book)">
                      <i class="fas fa-eye"></i> Read
                    </button>
                    <button class="btn btn-outline-secondary btn-sm" @click="showCommentModal(book, idx, 'owned')">
                      <i class="fas fa-comment"></i> Comment
                    </button>
                    <button class="btn btn-outline-success btn-sm" @click="downloadBook(book)">
                      <i class="fas fa-download"></i> Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Reading Section: Displays PDF for both owned and rented books -->
          <div v-if="selectedBook" class="reading-section mt-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5>Reading: {{ selectedBook.title }}</h5>
              <button class="btn btn-outline-danger btn-sm" @click="closeReadingView">
                <i class="fas fa-times"></i> Close Reading View
              </button>
            </div>
            <iframe
              v-if="selectedBook.pdfUrl"
              :src="selectedBook.pdfUrl"
              class="book-iframe"
              frameborder="0"
            ></iframe>
            <div v-else class="alert alert-warning">No PDF available for this book.</div>
          </div>
        </div>

        <!-- My Rentals -->
        <div v-else-if="dashboardTab === 'rentals'">
          <h4>My Rentals ({{ rentedBooks.length }})</h4>
          <div v-if="rentedBooks.length === 0" class="alert alert-info">No books rented yet.</div>
          <div class="row" v-else>
            <div class="col-md-4 mb-3" v-for="(book, idx) in rentedBooks" :key="book.id">
              <div class="card h-100 position-relative">
                <i v-if="isBookRead(book.id)" class="fas fa-check-circle text-success position-absolute top-0 end-0 m-2"></i>
                <img v-if="book.image" :src="book.image" class="card-img-top" style="height:180px;object-fit:cover;">
                <div class="card-body">
                  <h5 class="card-title">{{ book.title }}</h5>
                  <p class="card-text">{{ book.author }}</p>
                  <span class="badge bg-success">Rented</span>
                  <div class="mt-2">
                    <span class="badge bg-info">Return in: {{ getCountdown(book.id) }}</span>
                  </div>
                  <div class="d-flex align-items-center mt-2 gap-2">
                    <!-- Read button triggers viewBook, showing PDF in reading-section -->
                    <button class="btn btn-outline-primary btn-sm" @click="viewBook(book)">
                      <i class="fas fa-eye"></i> Read
                    </button>
                    <button class="btn btn-outline-secondary btn-sm" @click="showCommentModal(book, idx, 'rented')">
                      <i class="fas fa-comment"></i> Comment
                    </button>
                    <button class="btn btn-outline-danger btn-sm" @click="returnRentedBook(book.id, idx)">
                      <i class="fas fa-undo"></i> Return
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Reading Section: Repeated for rentals to ensure visibility -->
          <div v-if="selectedBook && dashboardTab === 'rentals'" class="reading-section mt-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5>Reading: {{ selectedBook.title }}</h5>
              <button class="btn btn-outline-danger btn-sm" @click="closeReadingView">
                <i class="fas fa-times"></i> Close Reading View
              </button>
            </div>
            <iframe
              v-if="selectedBook.pdfUrl"
              :src="selectedBook.pdfUrl"
              class="book-iframe"
              frameborder="0"
            ></iframe>
            <div v-else class="alert alert-warning">No PDF available for this book.</div>
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
                <tr v-for="(tx, idx) in transactionHistory" :key="tx.id">
                  <td>{{ tx.title }}</td>
                  <td class="text-capitalize">{{ tx.action === 'buy' ? 'Bought' : 'Rented' }}</td>
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
            <li class="list-group-item" v-for="(app, idx) in appointments" :key="app.id">
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
                  <button class="btn btn-success" type="submit" :disabled="appointmentLoading">
                    <span v-if="appointmentLoading" class="spinner-border spinner-border-sm"></span>
                    <span v-else>Send</span>
                  </button>
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
            <div class="mb-3">
              <label class="form-label">Age</label>
              <input v-model="user.Age" type="number" class="form-control">
            </div>
            <div class="mb-3">
              <label class="form-label">Phone Number</label>
              <input v-model="user.phoneNumber" type="tel" class="form-control">
            </div>
            <button class="btn btn-primary" type="submit" :disabled="settingsLoading">
              <span v-if="settingsLoading" class="spinner-border spinner-border-sm"></span>
              <span v-else>Save Changes</span>
            </button>
          </form>
          <div class="mt-4">
            <h6>Your Details:</h6>
            <p><strong>Name:</strong> {{ user.firstName || 'Not set' }}</p>
            <p><strong>Email:</strong> {{ user.email || 'Not set' }}</p>
            <p><strong>Age:</strong> {{ user.Age || 'Not set' }}</p>
            <p><strong>Phone Number:</strong> {{ user.phoneNumber || 'Not set' }}</p>
          </div>
          <div class="mt-4">
            <h6>Your Comments:</h6>
            <div v-if="userComments.length === 0" class="alert alert-info">No comments yet.</div>
            <ul class="list-group" style="height: 160px; overflow-y: scroll;" v-else>
              <li class="list-group-item" v-for="(comment, idx) in userComments" :key="idx">
                <strong>{{ comment.bookTitle }}</strong>: {{ comment.comment }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Comment Modal -->
        <div v-if="showComment" class="custom-modal-backdrop" @click.self="closeCommentModal">
          <div class="custom-modal">
            <div class="modal-header">
              <h5 class="modal-title">Add Comment for {{ currentBook.title }}</h5>
              <button type="button" class="btn-close" @click="closeCommentModal"></button>
            </div>
            <div class="modal-body">
              <input v-model="commentText" class="form-control mb-2" placeholder="Type your comment..." />
              <button class="btn btn-success" @click="addCommentToBook" :disabled="commentLoading">
                <span v-if="commentLoading" class="spinner-border spinner-border-sm"></span>
                <span v-else>Submit</span>
              </button>
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
    <footer class="text-white text-center footer" style="background-color: #2c3e50; padding: 40px 0px;">
      <div class="container">
        <p class="mb-0">© 2025 Library Management System. All rights reserved.</p>
      </div>
    </footer>
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
      user: { firstName: "", email: "", Age: null, phoneNumber: "" },
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
      appointment: { subject: "", details: "" },
      commentLoading: false,
      appointmentLoading: false,
      settingsLoading: false,
      selectedBook: null,
      countdownTimers: {},
      countdownDisplays: {},
      readBooks: new Set()
    };
  },
  computed: {
    totalBooks() {
      return this.ownedBooks.length + this.rentedBooks.length;
    },
    userComments() {
      const comments = [];
      [...this.ownedBooks, ...this.rentedBooks].forEach(book => {
        if (book.comments && book.comments.length) {
          book.comments.forEach(comment => {
            comments.push({ bookTitle: book.title, comment });
          });
        }
      });
      return comments;
    }
  },
  async mounted() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("No user logged in. Please log in.");
      this.$router.push("/login");
      return;
    }

    try {
      const user = await mockstorage.fetchUser(userId);
      if (!user) {
        toast.error("User not found. Please log in again.");
        this.$router.push("/login");
        return;
      }
      this.user = { ...user, Age: user.Age || null, phoneNumber: user.phoneNumber || "" };
      this.ownedBooks = await mockstorage.fetchBroughtBooks(userId);
      this.rentedBooks = await mockstorage.fetchBorrowedBooks(userId);
      this.transactionHistory = await mockstorage.fetchTransactionHistory(userId);
      this.appointments = await mockstorage.fetchAppointments(userId);
      localStorage.setItem(`broughtBooks_${userId}`, JSON.stringify(this.ownedBooks));
      localStorage.setItem(`borrowedBooks_${userId}`, JSON.stringify(this.rentedBooks));
      localStorage.setItem(`transactionHistory_${userId}`, JSON.stringify(this.transactionHistory));
      localStorage.setItem(`appointments_${userId}`, JSON.stringify(this.appointments));
      const readBooks = JSON.parse(localStorage.getItem(`readBooks_${userId}`) || "[]");
      this.readBooks = new Set(readBooks);
      this.rentedBooks.forEach((book, idx) => {
        if (book.rentalDate) {
          this.scheduleAutoReturn(book, idx);
          this.startCountdown(book.id);
        } else {
          console.warn(`No rentalDate for book ${book.id}`);
        }
      });
      toast.success("Profile data loaded successfully!");
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data. Using local data.");
      this.ownedBooks = JSON.parse(localStorage.getItem(`broughtBooks_${userId}`) || "[]");
      this.rentedBooks = JSON.parse(localStorage.getItem(`borrowedBooks_${userId}`) || "[]");
      this.transactionHistory = JSON.parse(localStorage.getItem(`transactionHistory_${userId}`) || "[]");
      this.appointments = JSON.parse(localStorage.getItem(`appointments_${userId}`) || "[]");
      const readBooks = JSON.parse(localStorage.getItem(`readBooks_${userId}`) || "[]");
      this.readBooks = new Set(readBooks);
      this.rentedBooks.forEach((book, idx) => {
        if (book.rentalDate) {
          this.scheduleAutoReturn(book, idx);
          this.startCountdown(book.id);
        }
      });
    }
  },
  beforeDestroy() {
    Object.values(this.countdownTimers).forEach(clearInterval);
  },
  methods: {
    async saveSettings() {
      this.settingsLoading = true;
      try {
        await mockstorage.saveUser({ ...this.user, id: this.user.id });
        toast.success("Profile updated successfully!");
      } catch (error) {
        console.error("Error saving settings:", error);
        toast.error("Failed to save settings.");
      } finally {
        this.settingsLoading = false;
      }
    },
    viewBook(book) {
      // Handles viewing both owned and rented books
      this.selectedBook = book;
      this.readBooks.add(book.id);
      localStorage.setItem(`readBooks_${this.user.id}`, JSON.stringify([...this.readBooks]));
      toast.success(`Opened ${book.title} for reading`);
    },
    closeReadingView() {
      this.selectedBook = null;
      toast.success("Closed reading view");
    },
    downloadBook(book) {
      if (!book.pdfUrl) {
        toast.error("No PDF available for this book.");
        return;
      }
      const link = document.createElement("a");
      link.href = book.pdfUrl;
      link.download = `${book.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloading ${book.title}`);
    },
    
    showCommentModal(book, idx, type) {
      this.currentBook = { ...book };
      this.currentBookIdx = idx;
      this.currentBookType = type;
      this.commentText = "";
      this.showComment = true;
      toast.info(`Opened comment modal for ${book.title}`);
    },
    closeCommentModal() {
      this.showComment = false;
      this.currentBook = {};
      this.currentBookIdx = null;
      this.currentBookType = "";
      this.commentText = "";
      toast.info("Closed comment modal");
    },
    async addCommentToBook() {
      if (!this.commentText) {
        toast.error("Comment cannot be empty.");
        return;
      }
      this.commentLoading = true;
      try {
        const comments = this.currentBook.comments ? [...this.currentBook.comments, this.commentText] : [this.commentText];
        await mockstorage.saveBookComment(this.currentBook.id, comments);
        this.currentBook.comments = comments;
        if (this.currentBookType === "owned") {
          this.ownedBooks[this.currentBookIdx] = { ...this.currentBook };
        } else if (this.currentBookType === "rented") {
          this.rentedBooks[this.currentBookIdx] = { ...this.currentBook };
        }
        localStorage.setItem(`broughtBooks_${this.user.id}`, JSON.stringify(this.ownedBooks));
        localStorage.setItem(`borrowedBooks_${this.user.id}`, JSON.stringify(this.rentedBooks));
        toast.success("Comment added successfully!");
        this.closeCommentModal();
      } catch (error) {
        console.error("Error adding comment:", error);
        toast.error("Failed to add comment.");
      } finally {
        this.commentLoading = false;
      }
    },
    async returnRentedBook(bookId, idx) {
      try {
        await mockstorage.returnBorrowedBook(bookId);
        this.rentedBooks.splice(idx, 1);
        localStorage.setItem(`borrowedBooks_${this.user.id}`, JSON.stringify(this.rentedBooks));
        clearInterval(this.countdownTimers[bookId]);
        delete this.countdownTimers[bookId];
        delete this.countdownDisplays[bookId];
        toast.success("Book returned successfully!");
      } catch (error) {
        console.error("Error returning book:", error);
        toast.error("Failed to return book.");
      }
    },
    async submitAppointment() {
      this.appointmentLoading = true;
      try {
        const newApp = {
          ...this.appointment,
          userId: this.user.id,
          date: new Date().toLocaleString(),
          type: "appointment"
        };
        await mockstorage.saveAppointment(newApp);
        this.appointments.push(newApp);
        localStorage.setItem(`appointments_${this.user.id}`, JSON.stringify(this.appointments));
        toast.success("Appointment created successfully!");
        this.showAppointmentModal = false;
        this.appointment = { subject: "", details: "" };
      } catch (error) {
        console.error("Error creating appointment:", error);
        toast.error("Failed to create appointment.");
      } finally {
        this.appointmentLoading = false;
      }
    },
    scheduleAutoReturn(book, idx) {
      if (!book.rentalDate) {
        console.warn(`No rentalDate for book ${book.id}`);
        return;
      }
      const rentalDate = new Date(book.rentalDate);
      const returnDate = new Date(rentalDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      const now = new Date();
      const timeUntilReturn = returnDate.getTime() - now.getTime();

      if (timeUntilReturn <= 0) {
        this.returnRentedBook(book.id, idx);
        return;
      }

      setTimeout(() => {
        this.returnRentedBook(book.id, idx);
        toast.info(`Book ${book.title} auto-returned after 30 days`);
      }, timeUntilReturn);
    },
    startCountdown(bookId) {
      this.countdownDisplays[bookId] = "";
      this.countdownTimers[bookId] = setInterval(() => {
        this.updateCountdown(bookId);
      }, 1000);
      this.updateCountdown(bookId);
    },
    updateCountdown(bookId) {
      const book = this.rentedBooks.find(b => b.id === bookId);
      if (!book || !book.rentalDate) {
        clearInterval(this.countdownTimers[bookId]);
        delete this.countdownTimers[bookId];
        delete this.countdownDisplays[bookId];
        return;
      }

      const rentalDate = new Date(book.rentalDate);
      const returnDate = new Date(rentalDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      const now = new Date();
      const timeLeft = returnDate.getTime() - now.getTime();

      if (timeLeft <= 0) {
        this.countdownDisplays[bookId] = "Overdue";
        return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24))) / (1000 * 60 * 60);
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60))) / (1000 * (60));
      const seconds = Math.floor((timeLeft % (1000 * (60))) / 1000);
      this.countdownDisplays[bookId] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    },
    getCountdown(bookId) {
      return this.countdownDisplays[bookId] || "No timer";
    },
    isBookRead(bookId) {
      return this.readBooks.has(bookId);
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
  padding: 10px;
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
  margin: 0px 8px;
  padding: 12px;
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
  display: inline-block;
  transition: all 0.2s;
}
.clickable {
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.clickable:hover {
  box-shadow: 0 2px 12px rgba(13, 110, 253, 0.15);
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
  box-shadow: 0 4px 32px rgba(0, 0,0, 0.25);
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
.reading-section {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 70vw;
  height: 90vh;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}
.book-iframe {
  width: 100%;
  height: 76vh;
  border: none;
  border-radius: 4px;
  overflow-y: scroll;
}
@media (max-width: 900px) {
  .conc {
    flex-direction: column;
    gap: 0;
  }
  .asideBar {
    width: 100%;
    min-width: unset;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: stretch;
    padding: 0;
    border-radius: 0;
    border-right: none;
    border-bottom: 1px solid #eee;
    background: #fafbfc;
    padding-bottom: 0;
  }
  .sidebar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0px;
    padding: 10px 4px;
    gap: 0;
    border-radius: 0;
    font-size: 0.95rem;
    width: 100%;
    min-width: unset;
    flex: 1;
  }
  .sidebar-label {
    display: none;
    font-size: 0.8rem;
    margin-top: 3px;
    text-align: center;
  }
  .displayAside {
    width: 100%;
    min-height: 100px;
    border-radius: 0 0 8px 8px;
  }
  .reading-section {
    position: fixed;
    top: 10px;
    height: 80vh;
    width: 90%;
    /* left: auto; */
    transform: translateX(-50%);
  }
  .book-iframe {
    height: 60vh;

    overflow-y: auto;
  }
}
</style>