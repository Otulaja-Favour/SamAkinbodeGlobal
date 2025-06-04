<template>
  <div class="container-fluid p-0">
    <!-- Desktop Navbar -->
    <nav class="navbar navbar-expand-lg navbar-custom d-none d-lg-flex">
      <div class="container-fluid">
        <RouterLink class="navbar-brand" to="#">
          <i class="fas fa-book-open"></i> BookVault
        </RouterLink>
        <div class="navbar-nav">
          <RouterLink class="nav-link" to="/dashboard"><i class="fas fa-home"></i> Home</RouterLink>
          <RouterLink class="nav-link" to="/books"><i class="fas fa-book"></i> Books</RouterLink>
          <RouterLink class="nav-link" to="/cart"><i class="fas fa-shopping-cart"></i> Cart</RouterLink>
          <RouterLink class="nav-link" to="/profile"><i class="fas fa-user"></i> Profile</RouterLink>
          <RouterLink class="nav-link" to="/logout"><i class="fas fa-sign-out-alt"></i> Logout</RouterLink>
        </div>
      </div>
    </nav>

    <!-- Mobile Navbar fixed at the bottom -->
    <nav class="navbar navbar-mobile d-flex d-lg-none">
      <div class="navbar-nav d-flex flex-row w-100 justify-content-around">
        <RouterLink class="nav-link" to="/dashboard"><i class="fas fa-home"></i><span>Home</span></RouterLink>
        <RouterLink class="nav-link" to="/books"><i class="fas fa-book"></i><span>Books</span></RouterLink>
        <RouterLink class="nav-link" to="/cart"><i class="fas fa-shopping-cart"></i><span>Cart</span></RouterLink>
        <RouterLink class="nav-link" to="/profile"><i class="fas fa-user"></i><span>Profile</span></RouterLink>
        <RouterLink class="nav-link" to="/logout"><i class="fas fa-sign-out-alt"></i><span>Logout</span></RouterLink>
      </div>
    </nav>



<div class="row">
      <div
        class="col-md-4 mb-4"
        v-for="book in paginatedBooks"
        :key="book.id"
      >
        <div class="card h-100">
          <img
            v-if="book.image"
            :src="book.image"
            class="card-img-top"
            alt="Book cover"
            style="height: 250px; object-fit: cover;"
          />
          <div class="card-body">
            <h5 class="card-title">{{ book.title }}</h5>
            <p class="card-text">{{ book.author }}</p>
            <p class="card-text">{{ book.description }}</p>
            <p style="display: flex; justify-content: space-between; align-items: center;" class="card-text fw-bold">Buy: ₦{{ book.price }} <span  class="card-text fw-bold">Rent: ₦{{ book.rent }}</span></p>
            <button class="btn btn-primary btn-sm mt-2" @click="openModal(book)">View</button>
          </div>
        </div>
      </div>
</div>

 <nav v-if="totalPages > 1" class="d-flex justify-content-center my-4">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="goToPage(currentPage - 1)">Previous</button>
        </li>
        <li
          class="page-item"
          v-for="page in totalPages"
          :key="page"
          :class="{ active: currentPage === page }"
        >
          <button class="page-link" @click="goToPage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="goToPage(currentPage + 1)">Next</button>
        </li>
      </ul>
    </nav>


     <div
      class="modal fade"
      tabindex="-1"
      :class="{ show: showModal }"
      style="display: block;"
      v-if="showModal"
      @click.self="closeModal"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedBook.title }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body d-flex flex-row flex-wrap">
            <img
              v-if="selectedBook.image"
              :src="selectedBook.image"
              alt="Book cover"
              class="me-4 mb-3"
              style="width: 250px; height: 350px; object-fit: cover; border-radius: 8px;"
              h1
            />
            <div style="flex: 1; min-width: 200px;">
              <h6>Author: {{ selectedBook.author }}</h6>
              <p>{{ selectedBook.description }}</p>
              <p style="display: flex; gap: 30px; align-items: center;" class=" fw-bold">Buy: ₦{{ selectedBook.price }} <span  class="fw-bold">Rent: ₦{{ selectedBook.rent }}</span></p>
              <div class="mt-4">
                <button class="btn btn-success me-2" @click="addToCart(selectedBook, 'borrow')">Borrow</button>
                <button class="btn btn-primary" @click="addToCart(selectedBook, 'buy')">Buy</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

     <div v-if="showModal" class="modal-backdrop fade show"></div>



  </div>
</template>

<script>
import booksstore from '@/stores/booksstore';

export default {
  props: {
    cartCount: Number // Optional: for parent-child communication
  },
  data() {
    return {
      books: [],
      currentPage: 1,
      pageSize: 10,
      showModal: false,
      selectedBook: {},
      cart: JSON.parse(localStorage.getItem('cart')) || [],
    }
  },
  computed: {
    paginatedBooks() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.books.slice(start, start + this.pageSize);
    },
    totalPages() {
      return Math.ceil(this.books.length / this.pageSize);
    },
  },
  async mounted() {
    this.books = await booksstore.fetchBooks();
    this.updateCartIcon();
  },
  methods: {
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    openModal(book) {
      this.selectedBook = book;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedBook = {};
    },
    addToCart(book, type) {
      const cartItem = {
        ...book,
        action: type, // 'buy' or 'borrow'
      };
      this.cart.push(cartItem);
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.updateCartIcon();
      this.showToast('Added to cart!');
      this.closeModal();
    },
    updateCartIcon() {
      // Emit event to parent or update a global store if you want the cart icon to update everywhere
      this.$emit('update-cart-count', this.cart.length);
      // Optionally, use an event bus or global state for cross-component updates
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: this.cart.length }));
    },
    showToast(message) {
      // Simple toast implementation
      const toast = document.createElement('div');
      toast.textContent = message;
      toast.style.position = 'fixed';
      toast.style.bottom = '30px';
      toast.style.right = '30px';
      toast.style.background = '#28a745';
      toast.style.color = '#fff';
      toast.style.padding = '12px 24px';
      toast.style.borderRadius = '6px';
      toast.style.zIndex = 9999;
      toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
      document.body.appendChild(toast);
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000);
    }
  }
};
</script>

<style scoped>
.navbar-custom {
  background-color: #2c3e50;
  padding: 10px 20px;
}
.navbar-brand {
  color: #ffffff !important;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  display: flex;
  align-items: center;
}
.navbar-brand i {
  margin-right: 8px;
}
.modal {
  background: rgba(0,0,0,0.3);
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  z-index: 1040;
}
.nav-link {
  color: #ffffff !important;
  margin-left: 15px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: color 0.2s;
}
.nav-link i {
  margin-right: 5px;
}
.nav-link:hover {
  color: #3498db !important;
}
@media (max-width: 991.98px) {
  .navbar-custom {
    display: none !important;
  }
  .navbar-mobile {
    display: flex !important;
    justify-content: space-around;
    align-items: center;
    background-color: #2c3e50;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    padding: 10px 0;
    z-index: 1000;
  }
  .navbar-mobile .nav-link {
    color: #ffffff !important;
    margin: 0;
    flex-direction: column;
    font-size: 0.9rem;
    text-align: center;
    padding: 0 4px;
  }
  .navbar-mobile .nav-link i {
    margin-right: 0;
    font-size: 1.3rem;
    display: block;
  }
  .navbar-mobile .nav-link span {
    font-size: 0.75rem;
    margin-top: 2px;
    display: block;
  }
}
@media (min-width: 992px) {
  .navbar-mobile {
    display: none !important;
  }
}
</style>