<template>
  <div>
    <!-- Admin Navbar (desktop: top, icons + text; mobile: bottom, icons only) -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary admin-navbar">
      <div class="container-fluid">
        <router-link class="navbar-brand fw-bold" to="/">BookVault Admin</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbar"
          aria-controls="adminNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="adminNavbar">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item" v-for="item in sidebarItems" :key="item.tab">
              <a
                class="nav-link"
                :class="{ active: adminTab === item.tab }"
                href="#"
                @click.prevent="adminTab = item.tab"
              >
                <i :class="item.icon"></i>
                <span class="ms-1 nav-label">{{ item.label }}</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="logout">
                <i class="fas fa-user-shield"></i>
                <span class="ms-1 nav-label">Admin</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Spacer to prevent navbar overlap on desktop -->
    <div class="admin-navbar-spacer d-none d-lg-block"></div>

    <!-- Responsive bottom nav for mobile (icons only, no text) -->
    <nav class="admin-bottom-nav d-lg-none">
      <ul>
        <li v-for="item in sidebarItems" :key="item.tab">
          <button
            class="btn btn-link"
            :class="{ active: adminTab === item.tab }"
            @click="adminTab = item.tab"
          >
            <i :class="item.icon"></i>
          </button>
        </li>
        <li>
          <button class="btn btn-link" @click="logout">
            <i class="fas fa-user-shield"></i>
          </button>
        </li>
      </ul>
    </nav>

    <!-- Spacer to prevent bottom nav overlap on mobile -->
    <div class="admin-bottom-nav-spacer d-lg-none"></div>

    <div class="container-fluid conc">
      <section class="displayAside">
        <!-- Overview -->
        <div v-if="adminTab === 'overview'">
          <h4>Welcome Admin!</h4>
          <div class="row mt-4">
            <div class="col-md-3 mb-3">
              <div class="card text-center">
                <div class="card-body">
                  <i class="fas fa-book fa-2x text-primary mb-2"></i>
                  <h5 class="card-title">{{ books.length }}</h5>
                  <p class="card-text">Total Books</p>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="card text-center">
                <div class="card-body">
                  <i class="fas fa-users fa-2x text-success mb-2"></i>
                  <h5 class="card-title">{{ users.length }}</h5>
                  <p class="card-text">Total Users</p>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="card text-center">
                <div class="card-body">
                  <i class="fas fa-calendar-alt fa-2x text-warning mb-2"></i>
                  <h5 class="card-title">{{ appointments.length }}</h5>
                  <p class="card-text">Appointments</p>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="card text-center">
                <div class="card-body">
                  <i class="fas fa-receipt fa-2x text-info mb-2"></i>
                  <h5 class="card-title">{{ transactions.length }}</h5>
                  <p class="card-text">Transactions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Manage Books -->
        <div v-else-if="adminTab === 'books'">
          <h4>Manage Books</h4>
          <!-- Add Book Form -->
          <form @submit.prevent="addOrUpdateBook" class="mb-4">
            <div class="row g-2">
              <div class="col-md-3">
                <input v-model="bookForm.title" type="text" class="form-control" placeholder="Title" required>
              </div>
              <div class="col-md-3">
                <input v-model="bookForm.author" type="text" class="form-control" placeholder="Author" required>
              </div>
              <div class="col-md-2">
                <input v-model="bookForm.price" type="number" class="form-control" placeholder="Price" required>
              </div>
              <div class="col-md-2">
                <input v-model="bookForm.rent" type="number" class="form-control" placeholder="Rent" required>
              </div>
              <div class="col-md-2">
                <input v-model="bookForm.image" type="text" class="form-control" placeholder="Image URL">
              </div>
            </div>
            <div class="row g-2 mt-2">
              <div class="col-md-8">
                <input v-model="bookForm.description" type="text" class="form-control" placeholder="Description">
              </div>
              <div class="col-md-2">
                <select v-model="bookForm.action" class="form-control" required>
                  <option disabled value="">Select Type</option>
                  <option value="broughtBook">Buy</option>
                  <option value="borrowedBook">Rent</option>
                </select>
              </div>
              <div class="col-md-2">
                <button class="btn btn-success w-100" type="submit">
                  {{ bookForm.id ? "Update" : "Add" }} Book
                </button>
              </div>
            </div>
          </form>
          <div v-if="books.length === 0" class="alert alert-info">No books available.</div>
          <div class="table-responsive" v-else>
            <table class="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Rent</th>
                  <th>Description</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="book in books" :key="book.id">
                  <td>{{ book.title }}</td>
                  <td>{{ book.author }}</td>
                  <td>{{ book.action === 'broughtBook' ? 'Buy' : 'Rent' }}</td>
                  <td>₦{{ book.price }}</td>
                  <td>₦{{ book.rent }}</td>
                  <td>{{ book.description }}</td>
                  <td>
                    <img v-if="book.image" :src="book.image" alt="Book" style="width:40px;height:40px;object-fit:cover;">
                  </td>
                  <td>
                    <button class="btn btn-primary btn-sm me-1" @click="editBook(book)">Edit</button>
                    <button class="btn btn-danger btn-sm" @click="deleteBook(book.id)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Manage Users -->
        <div v-else-if="adminTab === 'users'">
          <h4>Manage Users</h4>
          <div v-if="users.length === 0" class="alert alert-info">No users found.</div>
          <div class="table-responsive" v-else>
            <table class="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Phone</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.firstName }} {{ user.lastName }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.age }}</td>
                  <td>{{ user.phoneNumber }}</td>
                  <td>{{ user.role }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Appointments -->
        <div v-else-if="adminTab === 'appointments'">
          <h4>All Appointments</h4>
          <div v-if="appointments.length === 0" class="alert alert-info">No appointments found.</div>
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
                <tr v-for="app in appointments" :key="app.id || app.date">
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

        <!-- All Transactions -->
        <div v-else-if="adminTab === 'transactions'">
          <h4>All Transactions</h4>
          <div v-if="transactions.length === 0" class="alert alert-info">No transactions found.</div>
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
                <tr v-for="tx in transactions" :key="tx.reference">
                  <td>{{ tx.title }}</td>
                  <td>
                    <span v-if="getUser(tx.userId)">
                      {{ getUser(tx.userId).firstName }} {{ getUser(tx.userId).lastName }}
                    </span>
                    <span v-else>{{ tx.userId }}</span>
                  </td>
                  <td>{{ tx.type }}</td>
                  <td>₦{{ tx.price }}</td>
                  <td>{{ tx.date }}</td>
                  <td>{{ tx.reference }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import mockstorage from "@/stores/mockstorage";

export default {
  data() {
    return {
      adminTab: "overview",
      sidebarItems: [
        { tab: "overview", label: "Overview", icon: "fas fa-chart-bar" },
        { tab: "books", label: "Manage Books", icon: "fas fa-book" },
        { tab: "users", label: "Manage Users", icon: "fas fa-users" },
        { tab: "appointments", label: "Appointments", icon: "fas fa-calendar-alt" },
        { tab: "transactions", label: "All Transactions", icon: "fas fa-receipt" }
      ],
      books: [],
      users: [],
      appointments: [],
      transactions: [],
      bookForm: {
        id: "",
        title: "",
        author: "",
        price: "",
        rent: "",
        image: "",
        description: "",
        action: ""
      }
    };
  },
  async mounted() {
    await this.fetchAllData();
  },
  methods: {
    async fetchAllData() {
      this.books = await mockstorage.fetchAllBooks();
      this.users = await mockstorage.fetchUsers();
      this.appointments = await mockstorage.fetchAllAppointments();
      this.transactions = await mockstorage.fetchAllTransactions();
    },
    async addOrUpdateBook() {
      const book = { ...this.bookForm };
      // If editing, update; else, add new
      if (book.id) {
        await mockstorage.updateBook(book.id, book);
      } else {
        await mockstorage.addBook(book);
      }
      await this.fetchAllData();
      this.resetBookForm();
    },
    editBook(book) {
      this.bookForm = { ...book };
    },
    async deleteBook(bookId) {
      await mockstorage.deleteBook(bookId);
      await this.fetchAllData();
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
        action: ""
      };
    },
    logout() {
      this.$router.push('/');
    },
    getUser(userId) {
      return this.users.find(u => u.id === userId);
    }
  }
};
</script>

<style scoped>
.admin-navbar-spacer {
  height: 56px;
  width: 100%;
}
.admin-bottom-nav-spacer {
  height: 56px;
  width: 100%;
}
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
.navbar .navbar-brand {
  font-size: 1.5rem;
  letter-spacing: 1px;
}
.navbar .nav-link.active, .navbar .nav-link:hover {
  background: #0d6efd;
  color: #fff !important;
  border-radius: 6px;
}
.nav-label {
  display: inline;
}
.admin-bottom-nav {
  position: fixed;
  left: 0; right: 0; bottom: 0;
  background: #fff;
  border-top: 1px solid #eee;
  z-index: 2000;
  display: flex;
  justify-content: center;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.04);
  height: 56px;
}
.admin-bottom-nav ul {
  display: flex;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  justify-content: space-around;
  align-items: center;
  height: 100%;
}
.admin-bottom-nav li {
  flex: 1 1 0;
  text-align: center;
}
.admin-bottom-nav .btn-link {
  color: #0d6efd;
  font-size: 1.3rem;
  padding: 10px 0;
  width: 100%;
  border: none;
  background: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.admin-bottom-nav .active,
.admin-bottom-nav .btn-link.active {
  color: #fff;
  background: #0d6efd;
  border-radius: 0;
}
@media (max-width: 900px) {
  .conc {
    flex-direction: column;
    gap: 0;
  }
  .displayAside {
    width: 100%;
    min-height: 200px;
    border-radius: 0 0 8px 8px;
  }
  .admin-navbar {
    display: none;
  }
  .admin-bottom-nav {
    display: flex;
  }
  .nav-label {
    display: none !important;
  }
}
@media (min-width: 901px) {
  .admin-bottom-nav {
    display: none;
  }
  .admin-navbar {
    display: flex;
  }
  .nav-label {
    display: inline !important;
  }
}
</style>