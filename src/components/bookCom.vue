<template>
  <div class="container-fluid p-0">
    <nav-bar :cart-count="cartCount" />

    <div class="d-flex flex-wrap align-items-center gap-3 my-3">
      <h3 class="m-3">All Available Books</h3>
      <input
        v-model="search"
        class="form-control"
        style="max-width: 300px"
        placeholder="Search by title, author, or description..."
      />
      <select v-model="sortBy" class="form-select" style="max-width: 200px">
        <option value="">Sort By</option>
        <option value="date">Date Added (Newest)</option>
        <option value="priceLow">Price: Low to High</option>
        <option value="priceHigh">Price: High to Low</option>
      </select>
    </div>

    <!-- Spinner Loader -->
    <div v-if="loading" class="spinner-container">
      <div class="spinner-border text-primary" role="status" style="width: 4rem; height: 4rem">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Book List -->
    <div class="p-3" v-else>
      <div class="row">
        <div class="col-md-3 mb-4" v-for="book in paginatedBooks" :key="book.id">
          <div class="card h-100">
            <img
              v-if="book.image"
              :src="book.image"
              class="card-img-top"
              alt="Book cover"
              style="height: 200px; object-fit: cover"
            />
            <div class="card-body">
              <h5 class="card-title">{{ book.title }}</h5>
              <p class="card-text">{{ book.author }}</p>
              <p class="card-text">{{ book.description }}</p>
              <p
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  background-color: green;
                  color: white;
                  padding: 0px 10px;
                "
                class="card-text fw-bold"
              >
                Buy: ₦{{ book.price }}
                <span class="card-text fw-bold">Rent: ₦{{ book.rent }}</span>
              </p>
              <button class="btn btn-primary btn-sm mt-2" style="width: 90%; margin: 0 auto; display: flex; justify-content: center;" @click="openModal(book)">View</button>
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
    </div>

    <!-- Book Modal -->
    <div
      class="modal fade"
      tabindex="-1"
      :class="{ show: showModal }"
      style="display: block"
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
              style="width: 250px; height: 350px; object-fit: cover; border-radius: 8px"
            />
            <div style="flex: 1; min-width: 200px">
              <h6>Author: {{ selectedBook.author }}</h6>
              <p>{{ selectedBook.description }}</p>
              <p style="display: flex; gap: 30px; align-items: center" class="fw-bold">
                Buy: ₦{{ selectedBook.price }}
                <span class="fw-bold">Rent: ₦{{ selectedBook.rent }}</span>
              </p>
              <div class="mt-4">
                <button
                  class="btn btn-primary"
                  @click="addToCart(selectedBook, 'buy')"
                  style="margin-right: 30px"
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
  <footer class="text-white text-center footer" style="background-color: #2c3e50; padding: 40px 0px;">
    <div class="container">
      <p class="mb-0">© 2025 Library Management System. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
import mockstorage from '@/stores/mockstorage'
import NavBar from '@/components/navBar.vue'

export default {
  name: 'BookComponent',
  components: { NavBar },
  
  data() {
    return {
      books: [],
      currentPage: 1,
      pageSize: 10,
      showModal: false,
      selectedBook: {},
      cart: [],
      cartCount: 0,
      loading: true,
      search: '',
      sortBy: '',
      userId: null,
    }
  },

  computed: {
    filteredBooks() {
      let filtered = this.books
      if (this.search) {
        const s = this.search.toLowerCase()
        filtered = filtered.filter(
          (b) =>
            (b.title && b.title.toLowerCase().includes(s)) ||
            (b.author && b.author.toLowerCase().includes(s)) ||
            (b.description && b.description.toLowerCase().includes(s))
        )
      }
      
      // Sort books
      if (this.sortBy === 'date') {
        filtered = filtered.slice().sort((a, b) => {
          if (a.dateAdded && b.dateAdded) {
            return new Date(b.dateAdded) - new Date(a.dateAdded)
          }
          return Number(b.id) - Number(a.id)
        })
      } else if (this.sortBy === 'priceLow') {
        filtered = filtered.slice().sort((a, b) => Number(a.price) - Number(b.price))
      } else if (this.sortBy === 'priceHigh') {
        filtered = filtered.slice().sort((a, b) => Number(b.price) - Number(a.price))
      }
      return filtered
    },

    paginatedBooks() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredBooks.slice(start, start + this.pageSize)
    },

    totalPages() {
      return Math.ceil(this.filteredBooks.length / this.pageSize)
    }
  },

  methods: {
    loadCart() {
      try {
        const savedCart = sessionStorage.getItem('cart')
        if (savedCart) {
          this.cart = JSON.parse(savedCart)
          this.cartCount = this.cart.length
          this.updateCartIcon()
        }
      } catch (error) {
        console.error('Failed to load cart:', error)
        this.cart = []
        this.cartCount = 0
      }
    },

    async syncCart() {
      if (!this.userId) return
      try {
        // await mockstorage.saveUserCart(this.userId, this.cart)
      } catch (error) {
        console.error('Failed to sync cart:', error)
        this.showToast('Failed to sync cart with server', true)
      }
    },

    saveCart() {
      try {
        sessionStorage.setItem('cart', JSON.stringify(this.cart))
        this.syncCart()
      } catch (error) {
        console.error('Failed to save cart:', error)
        this.showToast('Failed to save cart', true)
      }
    },

    handleCartUpdate(event) {
      this.cartCount = event.detail || 0
    },

    updateCartIcon() {
      this.cartCount = this.cart.length
      window.dispatchEvent(new CustomEvent('cart-updated', { 
        detail: this.cartCount 
      }))
    },

    async addToCart(book, type) {
      if (!book?.id) {
        this.showToast('Invalid book data', true)
        return
      }

      // if (!this.userId) {
      //   this.showToast('Please login to add items to cart', true)
      //   this.$router.push('/')
      //   return
      // }

      if (this.isInCart(book, type === 'buy' ? 'borrow' : 'buy')) {
        this.showToast(
          `You can't ${type} this book because it's already in your cart as ${
            type === 'buy' ? 'rent' : 'buy'
          }`,
          true
        )
        return
      }

      if (this.isInCart(book, type)) {
        this.showToast(`Already in cart as ${type}.`, true)
        return
      }

      const cartItem = {
        id: book.id,
        title: book.title,
        author: book.author,
        image: book.image,
        action: type,
        price: type === 'buy' ? book.price : book.rent,
        dateAdded: new Date().toISOString()
      }

      this.cart.push(cartItem)
      this.saveCart()
      this.updateCartIcon()
      this.showToast('Added to cart!')
      this.closeModal()
    },

    isInCart(book, type) {
      return this.cart.some(item => item.id === book.id && item.action === type)
    },

    async fetchBooks() {
      try {
        this.loading = true
        const books = await mockstorage.fetchAllBooks()
        if (Array.isArray(books)) {
          this.books = books
        } else {
          throw new Error('Invalid books data received')
        }
      } catch (error) {
        console.error('Failed to fetch books:', error)
        this.showToast('Failed to load books', true)
        this.books = []
      } finally {
        this.loading = false
      }
    },

    async fetchUser() {
      try {
        const user = await mockstorage.getCurrentUser()
        this.userId = user?.id || null
        if (this.userId) {
          const serverCart = await mockstorage.getUserCart(this.userId)
          if (serverCart?.length) {
            this.cart = serverCart
            this.saveCart()
            this.updateCartIcon()
          }
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
        this.showToast('Failed to load user data', true)
      }
    },

    showToast(message, isError = false) {
      const toast = document.createElement('div')
      toast.textContent = message
      toast.style.position = 'fixed'
      toast.style.top = '10px'
      toast.style.right = '30px'
      toast.style.background = isError ? '#dc3545' : '#28a745'
      toast.style.color = '#fff'
      toast.style.padding = '12px 24px'
      toast.style.borderRadius = '6px'
      toast.style.zIndex = '9999'
      toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'
      
      document.body.appendChild(toast)
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 3000)
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },

    openModal(book) {
      this.selectedBook = { ...book }
      this.showModal = true
    },

    closeModal() {
      this.showModal = false
      this.selectedBook = {}
    }
  },

  async created() {
    this.loadCart()
    await Promise.all([this.fetchBooks(), this.fetchUser()])
    window.addEventListener('cart-updated', this.handleCartUpdate)
  },

  beforeUnmount() {
    this.saveCart()
    window.removeEventListener('cart-updated', this.handleCartUpdate)
  },

  watch: {
    cart: {
      handler() {
        this.saveCart()
      },
      deep: true
    },
    search() {
      this.currentPage = 1
    },
    sortBy() {
      this.currentPage = 1
    }
  }
}
</script>

<style scoped>
.spinner-container {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
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

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}
</style>