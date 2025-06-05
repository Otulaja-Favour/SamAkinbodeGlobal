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

    <!-- Responsive bottom nav for mobile (icons only) -->
    <nav class="admin-bottom-nav d-lg-none">
      <ul>
        <li v-for="item in sidebarItems" :key="item.tab">
          <button
            class="btn btn-link"
            :class="{ active: adminTab === item.tab }"
            @click="adminTab = item.tab"
          >
            <i :class="item.icon"></i>
            <!-- Hide label on mobile -->
            <span class="nav-label-mobile">{{ item.label }}</span>
          </button>
        </li>
        <li>
          <button class="btn btn-link" @click="logout">
            <i class="fas fa-user-shield"></i>
            <span class="nav-label-mobile">Admin</span>
          </button>
        </li>
      </ul>
    </nav>

    <!-- Spacer to prevent bottom nav overlap on mobile -->
    <div class="admin-bottom-nav-spacer d-lg-none"></div>

    <div class="container-fluid conc">
      <section class="displayAside">
        <!-- ...rest of your code remains unchanged... -->
        <!-- Overview, Manage Books, Manage Users, Appointments, Transactions -->
        <!-- ... -->
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
      transactions: []
    };
  },
  async mounted() {
    this.books = await mockstorage.fetchAllBooks();
    this.users = await mockstorage.fetchUsers();
    this.appointments = await mockstorage.fetchAllAppointments();
    this.transactions = await mockstorage.fetchAllTransactions();
  },
  methods: {
    async deleteBook(bookId) {
      await mockstorage.deleteBook(bookId);
      this.books = await mockstorage.fetchAllBooks();
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
/* Navbar spacing for desktop */
.admin-navbar-spacer {
  height: 56px; /* Adjust if your navbar is taller */
  width: 100%;
}

/* Bottom nav spacing for mobile */
.admin-bottom-nav-spacer {
  height: 56px; /* Same as .admin-bottom-nav height */
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
.nav-label-mobile {
  display: none;
}

/* Responsive: Hide text on mobile bottom nav, show on desktop top nav */
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
  .nav-label-mobile {
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