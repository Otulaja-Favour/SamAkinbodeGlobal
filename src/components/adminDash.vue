<template>
  <div>
    <!-- Responsive Navbar -->
    <nav class="admin-navbar">
      <ul>
        <li class="d-none d-lg-block bookvault-title">
          <i class="fas fa-book-reader me-2"></i>BookVault 
        </li>
        <li v-for="item in sidebarItems" :key="item.tab" @click="changeTab(item.tab)">
          <button :class="{ active: adminTab === item.tab }" class="nav-btn" :disabled="loadingTab === item.tab">
            <i :class="item.icon"></i>
            <span class="nav-label">{{ item.label }}</span>
          </button>
        </li>
        <li>
          <button class="nav-btn" :class="{ active: adminTab === 'profile' }" @click="changeTab('profile')" :disabled="loadingTab === 'profile'">
            <i class="fas fa-user-shield"></i>
            <span class="nav-label">Admin</span>
          </button>
        </li>
      </ul>
    </nav>

    <div class="container-fluid conc pt-4">
      <section class="displayAside">
        <!-- Overview -->
        <div v-if="adminTab === 'overview'">
          <h4>Welcome {{ adminProfile.name }}!</h4>
          <div class="row mt-4">
            <div class="col-6 col-md-3 mb-3" v-for="stat in overviewStats" :key="stat.label">
              <div class="card text-center">
                <div class="card-body">
                  <i :class="stat.icon" :style="{ color: stat.color }" class="fa-2x mb-2"></i>
                  <h5 class="card-title">{{ stat.value }}</h5>
                  <p class="card-text">{{ stat.label }}</p>
                </div>
              </div>
            </div>
          </div>
          <hr>
          <h5>Recent Activities</h5>
          <ul class="list-group">
            <li class="list-group-item" v-for="(activity, idx) in recentActivities" :key="idx">
              {{ activity }}
            </li>
            <li v-if="recentActivities.length === 0" class="list-group-item text-muted">No recent activities.</li>
          </ul>
        </div>

        <!-- Books -->
        <div v-else-if="adminTab === 'books'">
          <h4>Manage Book Store</h4>
          <div class="d-flex flex-wrap gap-2 mb-3">
            <input v-model="bookSearch" class="form-control" style="max-width:200px" placeholder="Search book...">
            <input v-model="bookDateFilter" type="date" class="form-control" style="max-width:170px">
            <button class="btn btn-success" @click="openBookModal('add')" :disabled="bookFormLoading">
              <span v-if="bookFormLoading" class="spinner-border spinner-border-sm"></span>
              <span v-else>Add Book</span>
            </button>
          </div>
          <!-- Book Modal -->
          <div v-if="showBookModal" class="modal-backdrop">
            <div class="modal d-flex align-items-center justify-content-center">
              <div class="bg-white p-4 rounded" style="min-width:350px;max-width:500px;">
                <h5 class="mb-3">{{ modalMode === 'edit' ? 'Edit Book' : 'Add Book' }}</h5>
                <form @submit.prevent="addOrUpdateBook">
                  <div class="mb-2">
                    <input v-model="bookForm.title" type="text" class="form-control" placeholder="Title" required>
                  </div>
                  <div class="mb-2">
                    <input v-model="bookForm.author" type="text" class="form-control" placeholder="Author" required>
                  </div>
                  <div class="mb-2">
                    <input v-model.number="bookForm.price" type="number" class="form-control" placeholder="Buy Amount (₦)" required>
                  </div>
                  <div class="mb-2">
                    <input v-model.number="bookForm.rent" type="number" class="form-control" placeholder="Rent Amount (₦)" required>
                  </div>
                  <div class="mb-2">
                    <textarea v-model="bookForm.description" class="form-control" :maxlength="2500" rows="5" placeholder="Description (max 400 words)" required></textarea>
                    <div class="small text-muted">{{ wordCount(bookForm.description) }}/400 words</div>
                  </div>
                  <!-- Book Modal (replace the cover image input section) -->
<div class="mb-2">
  <label class="form-label">Cover Image</label>
  <input type="file" class="form-control" accept="image/*" @change="handleImageUpload">
  <div v-if="bookForm.image" class="mt-2">
    <img :src="bookForm.image" alt="Preview" style="max-width: 120px; max-height: 120px; object-fit:cover;">
    <div class="small text-muted">Cover Preview</div>
  </div>
</div>
                  <div class="mb-2">
                    <input v-model="bookForm.pdfUrl" type="url" class="form-control" placeholder="Book File URL (PDF, Google Drive, etc)" required>
                  </div>
                  <div class="d-flex justify-content-end">
                    <button class="btn btn-secondary me-2" type="button" @click="closeBookModal" :disabled="bookFormLoading">Cancel</button>
                    <button class="btn btn-success" type="submit" :disabled="bookFormLoading">
                      <span v-if="bookFormLoading" class="spinner-border spinner-border-sm"></span>
                      <span v-else>{{ modalMode === 'edit' ? 'Update' : 'Add' }}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div v-if="filteredBooks.length === 0" class="alert alert-info">No books found.</div>
          <div class="table-responsive" v-else>
            <table class="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Buy</th>
                  <th>Rent</th>
                  <th>Description</th>
                  <th>Image</th>
                  <th>File</th>
                  <th>Date Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="book in filteredBooks" :key="book.id">
                  <td>{{ book.title }}</td>
                  <td>{{ book.author }}</td>
                  <td>₦{{ book.price }}</td>
                  <td>₦{{ book.rent }}</td>
                  <td>{{ book.description.slice(0, 400) }}<span v-if="book.description.length > 400">...</span></td>
                  <td>
                    <img v-if="book.image" :src="book.image" alt="Book" style="width:40px;height:40px;object-fit:cover;">
                  </td>
                  <td>
                    <a v-if="book.pdfUrl" :href="book.pdfUrl" target="_blank" class="badge bg-info">File Link</a>
                  </td>
                  <td>{{ book.dateAdded }}</td>
                  <td>
                    <button class="btn btn-primary btn-sm me-1" @click="editBook(book)" :disabled="bookFormLoading">Edit</button>
                    <button class="btn btn-danger btn-sm" @click="deleteBook(book.id)" :disabled="bookFormLoading">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Users -->
        <div v-else-if="adminTab === 'users'">
          <h4>All Users</h4>
          <div v-if="users.length === 0" class="alert alert-info">No users found.</div>
          <div class="table-responsive" v-else>
            <table class="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Borrowed</th>
                  <th>Bought</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.firstName }} {{ user.lastName }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.role }}</td>
                  <td>{{ user.borrowedBooks?.length || 0 }}</td>
                  <td>{{ user.broughtBooks?.length || 0 }}</td>
                  <td>
                    <button class="btn btn-info btn-sm" @click="selectUser(user)">View Books</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- User Modal -->
          <div v-if="selectedUser" class="custom-modal-backdrop" @click.self="selectedUser = null">
            <div class="custom-modal">
              <div class="modal-header">
                <h5 class="modal-title">User Books</h5>
                <button type="button" class="btn-close" @click="selectedUser = null"></button>
              </div>
              <div class="modal-body">
                <h6>Borrowed Books</h6>
                <ul>
                  <li v-for="book in selectedUser.borrowedBooks || []" :key="book.id">
                    {{ book.title }} by {{ book.author }}
                  </li>
                  <li v-if="!selectedUser.borrowedBooks || selectedUser.borrowedBooks.length === 0">None</li>
                </ul>
                <h6>Bought Books</h6>
                <ul>
                  <li v-for="book in selectedUser.broughtBooks || []" :key="book.id">
                    {{ book.title }} by {{ book.author }}
                  </li>
                  <li v-if="!selectedUser.broughtBooks || selectedUser.broughtBooks.length === 0">None</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Appointments -->
        <div v-else-if="adminTab === 'appointments'">
          <h4>All Appointments</h4>
          <input v-model="appointmentDateFilter" type="date" class="form-control mb-2" style="max-width:170px">
          <div v-if="filteredAppointments.length === 0" class="alert alert-info">No appointments found.</div>
          <div class="table-responsive" v-else>
            <table class="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Subject</th>
                  <th>Details</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="app in filteredAppointments" :key="app.date + '-' + app.userId">
                  <td>
                    <span v-if="getUser(app.userId)">
                      {{ getUser(app.userId).firstName }} {{ getUser(app.userId).lastName }}
                    </span>
                    <span v-else>{{ app.userId }}</span>
                  </td>
                  <td>{{ app.subject }}</td>
                  <td>{{ app.details }}</td>
                  <td>{{ app.date }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Transactions -->
        <div v-else-if="adminTab === 'transactions'">
          <h4>All Transactions</h4>
          <input v-model="transactionDateFilter" type="date" class="form-control mb-2" style="max-width:170px">
          <div v-if="filteredTransactions.length === 0" class="alert alert-info">No transactions found.</div>
          <div class="table-responsive" v-else>
            <table class="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>User</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Reference</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tx in filteredTransactions" :key="tx.reference">
                  <td>{{ tx.title }}</td>
                  <td>
                    <span v-if="getUser(tx.userId)">
                      {{ getUser(tx.userId).firstName }} {{ getUser(tx.userId).lastName }}
                    </span>
                    <span v-else>{{ tx.userId }}</span>
                  </td>
                  <td>{{ tx.type }}</td>
                  <td>₦{{ tx.price || tx.rent }}</td>
                  <td>{{ tx.date }}</td>
                  <td>{{ tx.reference }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Admin Profile -->
        <div v-else-if="adminTab === 'profile'">
          <nav class="profile-navbar mb-3">
            <button class="btn btn-outline-primary me-2" @click="profileTab = 'details'">Details</button>
            <button class="btn btn-outline-primary me-2" @click="profileTab = 'edit'">Edit Profile</button>
            <button class="btn btn-outline-danger" @click="logout">Logout</button>
          </nav>
          <div v-if="profileTab === 'details'">
            <h4>Admin Details</h4>
            <p><strong>Name:</strong> {{ adminProfile.name }}</p>
            <p><strong>Email:</strong> {{ adminProfile.email }}</p>
            <h5 class="mt-4">All User Comments</h5>
            <input v-model="commentDateFilter" type="date" class="form-control mb-2" style="max-width:170px">
            <ul class="list-group">
              <li v-for="c in filteredComments" :key="c.id" class="list-group-item">
                <strong>{{ c.userName }}:</strong> {{ c.text }} <span class="text-muted small">({{ c.date }})</span>
              </li>
              <li v-if="filteredComments.length === 0" class="list-group-item text-muted">No comments found.</li>
            </ul>
          </div>
          <div v-else-if="profileTab === 'edit'">
            <h4>Edit Profile</h4>
            <form @submit.prevent="saveAdminProfile" style="max-width:400px;">
              <div class="mb-3">
                <label class="form-label">Full Name</label>
                <input v-model="adminProfile.name" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="adminProfile.email" type="email" class="form-control" required>
              </div>
              <button class="btn btn-primary" type="submit" :disabled="profileLoading">
                <span v-if="profileLoading" class="spinner-border spinner-border-sm"></span>
                <span v-else>Save Changes</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import mockstorage from "@/stores/mockstorage";
import bookstore from "@/stores/booksstore";

export default {
  data() {
    return {
      adminTab: "overview",
      profileTab: "details",
      sidebarItems: [
        { tab: "overview", label: "Home", icon: "fas fa-chart-bar" },
        { tab: "books", label: "Books", icon: "fas fa-book" },
        { tab: "users", label: "Users", icon: "fas fa-users" },
        { tab: "appointments", label: "Appointments", icon: "fas fa-calendar-alt" },
        { tab: "transactions", label: "Transactions", icon: "fas fa-receipt" }
      ],
      books: [],
      users: [],
      appointments: [],
      transactions: [],
      comments: [],
      bookForm: {
        id: "",
        title: "",
        author: "",
        price: "",
        rent: "",
        image: "",
        description: "",
        pdfUrl: "",
        dateAdded: ""
      },
      adminProfile: {
        name: "Akinbode",
        email: "otulajafavour@gmail.com"
      },
      selectedUser: null,
      showBookModal: false,
      modalMode: "add",
      bookFormLoading: false,
      profileLoading: false,
      loadingTab: "",
      bookSearch: "",
      bookDateFilter: "",
      appointmentDateFilter: "",
      transactionDateFilter: "",
      commentDateFilter: ""
    };
  },
  computed: {
    overviewStats() {
      return [
        { label: "Total Books", value: this.books.length, icon: "fas fa-book", color: "#0d6efd" },
        { label: "Total Users", value: this.users.length, icon: "fas fa-users", color: "#198754" },
        { label: "Total Appointments", value: this.allAppointments.length, icon: "fas fa-calendar-alt", color: "#ffc107" },
        { label: "Total Transactions", value: this.allTransactions.length, icon: "fas fa-receipt", color: "#0dcaf0" }
      ];
    },
    allAppointments() {
      let all = [];
      this.users.forEach(u => {
        if (Array.isArray(u.appointments)) {
          all = all.concat(u.appointments.map(a => ({ ...a, userId: u.id })));
        }
      });
      return all;
    },
    allTransactions() {
      let all = [];
      this.users.forEach(u => {
        if (Array.isArray(u.transactionHistory)) {
          all = all.concat(u.transactionHistory.map(t => ({ ...t, userId: u.id })));
        }
      });
      return all;
    },
    filteredBooks() {
      let books = this.books;
      if (this.bookSearch) {
        books = books.filter(b => b.title.toLowerCase().includes(this.bookSearch.toLowerCase()));
      }
      if (this.bookDateFilter) {
        books = books.filter(b => b.dateAdded && b.dateAdded.startsWith(this.bookDateFilter));
      }
      return books.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    },
    filteredTransactions() {
      let txs = this.allTransactions;
      if (this.transactionDateFilter) {
        txs = txs.filter(t => t.date && t.date.startsWith(this.transactionDateFilter));
      }
      return txs.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    filteredAppointments() {
      let apps = this.allAppointments;
      if (this.appointmentDateFilter) {
        apps = apps.filter(a => a.date && a.date.startsWith(this.appointmentDateFilter));
      }
      return apps.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    filteredComments() {
      let comments = this.comments;
      if (this.commentDateFilter) {
        comments = comments.filter(c => c.date && c.date.startsWith(this.commentDateFilter));
      }
      return comments.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    recentActivities() {
      let activities = [];
      this.allTransactions.forEach(tx => {
        activities.push({
          type: "Transaction",
          detail: `${tx.type} - ${tx.title} (₦${tx.price || tx.rent}) by ${this.getUser(tx.userId)?.firstName || tx.userId}`,
          date: tx.date
        });
      });
      this.allAppointments.forEach(app => {
        activities.push({
          type: "Appointment",
          detail: `${app.subject} by ${this.getUser(app.userId)?.firstName || app.userId}`,
          date: app.date
        });
      });
      activities.sort((a, b) => new Date(b.date) - new Date(a.date));
      return activities.slice(0, 5).map(a => `[${a.type}] ${a.detail} (${a.date})`);
    }
  },
  async mounted() {
    await this.fetchAllData();
    const saved = localStorage.getItem('adminProfile');
    if (saved) {
      this.adminProfile = JSON.parse(saved);
    }
  },
  methods: {
    wordCount(text) {
      if (!text) return 0;
      return text.trim().split(/\s+/).length;
    },
    async fetchAllData() {
      this.books = await bookstore.fetchAllBooks();
      this.users = await mockstorage.fetchUsers();
      this.appointments = await mockstorage.fetchAllAppointments();
      this.transactions = await mockstorage.fetchAllTransactions();
      // Fetch all comments (adapt to your API)
      this.comments = await mockstorage.fetchAllComments ? await mockstorage.fetchAllComments() : [];
    },
    changeTab(tab) {
      if (this.loadingTab) return;
      this.loadingTab = tab;
      setTimeout(() => {
        this.adminTab = tab;
        this.loadingTab = "";
      }, 400); // Simulate loading
    },
    openBookModal(mode, book = null) {
      this.modalMode = mode;
      if (mode === "edit" && book) {
        this.bookForm = { ...book };
      } else {
        this.resetBookForm();
      }
      this.showBookModal = true;
    },
    closeBookModal() {
      this.showBookModal = false;
      this.resetBookForm();
      this.bookFormLoading = false;
    },
    async addOrUpdateBook() {
      this.bookFormLoading = true;
      try {
        this.bookForm.price = Number(this.bookForm.price) || 0;
        this.bookForm.rent = Number(this.bookForm.rent) || 0;
        this.bookForm.dateAdded = new Date().toISOString().slice(0, 10);
        if (this.wordCount(this.bookForm.description) > 400) {
          this.showToast("Description must not exceed 400 words.", true);
          this.bookFormLoading = false;
          return;
        }
        if (!this.bookForm.pdfUrl.startsWith("http")) {
          this.showToast("Please provide a valid file URL.", true);
          this.bookFormLoading = false;
          return;
        }
        if (this.modalMode === "edit" && this.bookForm.id) {
          await bookstore.updateBook(this.bookForm.id, this.bookForm);
          this.showToast("Book updated successfully!");
        } else {
          await bookstore.addBook(this.bookForm);
          this.showToast("Book added successfully!");
        }
        await this.fetchAllData();
        this.closeBookModal();
      } catch (e) {
        this.showToast("Failed to save book!", true);
      } finally {
        this.bookFormLoading = false;
      }
    },
    
    editBook(book) {
      this.openBookModal("edit", book);
    },
    async deleteBook(bookId) {
      if (confirm("Are you sure you want to delete this book?")) {
        this.bookFormLoading = true;
        try {
          await bookstore.deleteBook(bookId);
          await this.fetchAllData();
          this.showToast("Book deleted successfully!", false);
        } catch (e) {
          this.showToast("Failed to delete book!", true);
        } finally {
          this.bookFormLoading = false;
        }
      }
    },
    resetBookForm() {
      this.bookForm = {
        id: "",
        title: "",
        author: "",
        price: "",
        rent: "",
        image: "",
        description: "",
        pdfUrl: "",
        dateAdded: ""
      };
    },
    logout() {
      this.$router.push('/');
    },
    getUser(userId) {
      return this.users.find(u => u.id === userId);
    },
    selectUser(user) {
      this.selectedUser = user;
    },
    async saveAdminProfile() {
      this.profileLoading = true;
      try {
        localStorage.setItem('adminProfile', JSON.stringify(this.adminProfile));
        this.showToast('Admin profile updated!');
        this.profileTab = 'details';
      } catch {
        this.showToast('Failed to update profile', true);
      } finally {
        this.profileLoading = false;
      }
    },
    showToast(message, error = false) {
      const toast = document.createElement('div');
      toast.textContent = message;
      toast.style.position = 'fixed';
      toast.style.top = '20px';
      toast.style.right = '30px';
      toast.style.background = error ? '#dc3545' : '#28a745';
      toast.style.color = '#fff';
      toast.style.padding = '12px 24px';
      toast.style.borderRadius = '6px';
      toast.style.zIndex = 9999;
      toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
      document.body.appendChild(toast);
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 2000);
    }
  }
};
</script>

<style scoped>
.admin-navbar {
  background: #0d6efd;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 1100;
}
.admin-navbar ul {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
}
.admin-navbar li {
  flex: 1;
  text-align: center;
}
.bookvault-title {
  font-weight: bold;
  font-size: 1.2rem;
  color: #fff;
  padding: 12px 0;
}
@media (max-width: 991px) {
  .bookvault-title {
    display: none !important;
  }
}
.nav-btn {
  background: none;
  border: none;
  color: #fff;
  padding: 12px 0 2px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.1rem;
  transition: background 0.2s;
  position: relative;
}
.nav-btn.active,
.nav-btn:focus {
  background: #084298;
  color: #fff;
}
.nav-label {
  display: block;
  font-size: 0.95rem;
  margin-top: 2px;
  color: #fff;
  font-weight: 500;
}
@media (max-width: 900px) {
  .admin-navbar {
    position: fixed;
    bottom: 0;
    top: auto;
    width: 100vw;
    border-top: 1px solid #e0e0e0;
    padding: 0;
  }
  .container-fluid.conc {
    padding-bottom: 60px;
  }
}
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  z-index: 1040;
}
.modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.custom-modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  z-index: 1050;
}
.custom-modal {
  background: #fff;
  border-radius: 8px;
  max-width: 400px;
  margin: 40px auto;
  padding: 24px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.15);
}
.profile-navbar {
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
}
</style>