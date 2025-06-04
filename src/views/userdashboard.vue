<template>
  <div class="container-fluid min-vh-100 d-flex flex-column bg-light">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container-fluid">
        <a class="navbar-brand fw-bold" href="#">Book Dashboard</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto align-items-center">
            <li class="nav-item">
              <span class="text-muted">{{ new Date().toLocaleDateString() }}</span>
            </li>
            <li class="nav-item">
              <button class="btn btn-primary ms-3">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="d-flex flex-grow-1">
      <!-- Sidebar -->
      <aside class="sidebar bg-dark text-white d-none d-md-flex flex-column">
        <div class="sidebar-header p-3 text-center">
          <h2 class="h5 fw-bold">Navigation</h2>
        </div>
        <ul class="nav flex-column">
          <li class="nav-item">
            <a href="#" class="nav-link text-white d-flex align-items-center py-3 px-4">
              <i class="bi bi-book me-2"></i> Books
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link text-white d-flex align-items-center py-3 px-4">
              <i class="bi bi-person me-2"></i> Profile
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link text-white d-flex align-items-center py-3 px-4">
              <i class="bi bi-cart me-2"></i> Cart
            </a>
          </li>
        </ul>
      </aside>

      <!-- Main Content -->
      <main class="flex-grow-1 p-4">
        <header class="mb-4">
          <h1 class="h2 fw-bold text-dark">Welcome, User!</h1>
        </header>

        <!-- Dashboard Cards -->
        <section class="row row-cols-1 row-cols-md-3 g-4 mb-4">
          <div class="col">
            <div class="card h-100">
              <div class="card-body">
                <h3 class="card-title h5">Buy Books</h3>
                <p class="card-text text-muted">Browse and purchase your favorite books.</p>
                <button class="btn btn-primary btn-sm">Shop Books</button>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card h-100">
              <div class="card-body">
                <h3 class="card-title h5">Profile</h3>
                <p class="card-text text-muted">View and update your profile information.</p>
                <button class="btn btn-secondary btn-sm">Edit Profile</button>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card h-100">
              <div class="card-body">
                <h3 class="card-title h5">Cart</h3>
                <p class="card-text text-muted">View books in your cart and proceed to checkout.</p>
                <button class="btn btn-success btn-sm">Go to Cart</button>
              </div>
            </div>
          </div>
        </section>

        <!-- Recent Activity -->
        <section class="card">
          <div class="card-body">
            <h2 class="h4 fw-bold mb-3">Recent Activity</h2>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">Bought "Atomic Habits"</li>
              <li class="list-group-item">Updated profile</li>
              <li class="list-group-item">Added "Clean Code" to cart</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Include Bootstrap Icons */
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");

.sidebar {
  width: 220px;
  min-height: 100vh;
}

.sidebar-header {
  background: #343a40;
}

.nav-link:hover {
  background: #495057;
  transition: background 0.2s;
}

.card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .sidebar {
    width: 60px;
  }
  .sidebar-header h2 {
    font-size: 0.9rem;
  }
  .nav-link span {
    display: none;
  }
}
    </style>