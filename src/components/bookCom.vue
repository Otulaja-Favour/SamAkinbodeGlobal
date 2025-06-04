<template>
  <div class="container-fluid p-0">
    <!-- Navbar Component (imported, not hardcoded here) -->
    <nav-bar :cart-count="cartCount" />

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
            <p style="display: flex; justify-content: space-between; align-items: center;" class="card-text fw-bold">
              Buy: ₦{{ book.price }}
              <span class="card-text fw-bold">Rent: ₦{{ book.rent }}</span>
            </p>
            <button class="btn btn-primary btn-sm mt-2" @click="openModal(book)">View</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <nav v-if="totalPages > 1" class="d-flex justify-content-center my-4 py-4">
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

    <!-- Book Modal -->
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
            />
            <div style="flex: 1; min-width: 200px;">
              <h6>Author: {{ selectedBook.author }}</h6>
              <p>{{ selectedBook.description }}</p>
              <p style="display: flex; gap: 30px; align-items: center;" class="fw-bold">
                Buy: ₦{{ selectedBook.price }}
                <span class="fw-bold">Rent: ₦{{ selectedBook.rent }}</span>
              </p>
              <div class="mt-4">
                <button
                  class="btn btn-primary"
                  @click="addToCart(selectedBook, 'buy')"
                  style="margin-right: 30px;"
                  :disabled="isInCart(selectedBook, 'borrow')"
                >
                  Buy
                </button>
                <button
                  class="btn btn-success me-2"
                  @click="addToCart(selectedBook, 'borrow')"
                  :disabled="isInCart(selectedBook, 'buy')"
                >
                  Rent
                </button>
                <div v-if="isInCart(selectedBook, 'buy')" class="text-danger mt-2 small">
                  Already bought. You can't rent at the same time.
                </div>
                <div v-if="isInCart(selectedBook, 'borrow')" class="text-danger mt-2 small">
                  Already rented. You can't buy at the same time.
                </div>
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
import NavBar from '@/components/navBar.vue';

export default {
  components: { NavBar },
  data() {
    return {
      books: [],
      currentPage: 1,
      pageSize: 10,
      showModal: false,
      selectedBook: {},
      cart: JSON.parse(localStorage.getItem('cart')) || [],
      cartCount: JSON.parse(localStorage.getItem('cart'))?.length || 0,
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
    window.addEventListener('cart-updated', this.handleCartUpdate);
  },
  beforeUnmount() {
    window.removeEventListener('cart-updated', this.handleCartUpdate);
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
    isInCart(book, type) {
      return this.cart.some(
        (item) => item.id === book.id && item.action === type
      );
    },
    addToCart(book, type) {
      // Prevent adding both buy and borrow for the same book
      if (this.isInCart(book, type === 'buy' ? 'borrow' : 'buy')) {
        this.showToast(
          `You can't ${type} this book because it's already in your cart as ${type === 'buy' ? 'rent' : 'buy'}.`
        );
        return;
      }
      // Prevent duplicate add
      if (this.isInCart(book, type)) {
        this.showToast(`Already in cart as ${type}.`);
        return;
      }
      const cartItem = {
        ...book,
        action: type, // 'buy' or 'borrow'
        price: type === 'buy' ? book.price : book.rent,
      };
      this.cart.push(cartItem);
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.updateCartIcon();
      this.showToast('Added to cart!');
      this.closeModal();
    },
    updateCartIcon() {
      this.cartCount = this.cart.length;
      this.$emit('update-cart-count', this.cartCount);
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: this.cartCount }));
    },
    handleCartUpdate(e) {
      this.cartCount = e.detail;
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
.badge {
  background: #dc3545;
  color: #fff;
  border-radius: 50%;
  padding: 2px 8px;
  font-size: 0.8rem;
  margin-left: 4px;
  vertical-align: top;
}
</style>