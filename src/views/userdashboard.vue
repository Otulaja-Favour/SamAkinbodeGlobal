<template>
  <div class="container-fluid p-0">
    <navBar :cartCount="cartCount" />

    <div class="hero container-fluid text-center my-4 py-4">
      <h4>Welcome to BookVault</h4>
      <p>Discover, Buy & Rent Your Favorite spiritual inspiring Books</p>
      <input
        type="search"
        v-model="search"
        class="form-control w-50 mx-auto"
        placeholder="Search for a book..."
      />
    </div>

    <h3 class="m-3">Popular Books</h3>

    <!-- Error Alert -->
    <div v-if="error" class="alert alert-danger text-center my-4">
      {{ error }}
    </div>

    <!-- Spinner Loader -->
    <div v-if="loading" class="spinner-container">
      <div class="spinner-border text-primary" role="status" style="width: 4rem; height: 4rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div class="row p-4" v-else-if="!error">
      <div
        class="col-md-3 mb-4"
        v-for="book in randomBooks"
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
          </div>
        </div>
      </div>
    </div>

    <div class="text-center my-4 py-4">
      <RouterLink to="/books" class="btn btn-primary">
        View More <i class="fas fa-arrow-right"></i>
      </RouterLink>
    </div>
  </div>
  <footer class="text-white text-center footer" style="background-color: #2c3e50; padding: 40px 0px;">
    <div class="container">
      <p class="mb-0">© 2025 Library Management System. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
import navBar from '@/components/navBar.vue'
import mockstorage from '@/stores/mockstorage'

export default {
  components: { navBar },
  
  data() {
    return {
      books: [],
      search: "",
      loading: true,
      error: null,
      cartCount: 0 // Changed initial value
    }
  },

  computed: {
    filteredBooks() {
      if (!this.search) return this.books
      const s = this.search.toLowerCase()
      return this.books.filter(
        (book) =>
          book?.title?.toLowerCase().includes(s) ||
          book?.author?.toLowerCase().includes(s) ||
          book?.description?.toLowerCase().includes(s)
      )
    },

    randomBooks() {
      try {
        if (!this.filteredBooks.length) return []
        let arr = [...this.filteredBooks]
        // Fisher-Yates shuffle algorithm
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
        }
        return arr.slice(0, 6)
      } catch (error) {
        console.error('Error in randomBooks:', error)
        return []
      }
    }
  },

  methods: {
     updateCartCount() {
      try {
        const cart = JSON.parse(sessionStorage.getItem('cart') || '[]')
        this.cartCount = cart.length
        // Dispatch event for navbar to catch
        window.dispatchEvent(new CustomEvent('cart-updated', { 
          detail: cart.length 
        }))
      } catch (error) {
        console.error('Failed to update cart count:', error)
        this.cartCount = 0
      }
    },

    async fetchBooks() {
      try {
        this.loading = true
        this.error = null
        
        // Try to get books from session storage first
        const cachedBooks = sessionStorage.getItem('dashboard_books')
        if (cachedBooks) {
          this.books = JSON.parse(cachedBooks)
          this.loading = false
          
          // Fetch fresh data in background
          await this.refreshBooks()
          return
        }
        
        // If no cached data, fetch from API
        await this.refreshBooks()
      } catch (error) {
        console.error('Failed to fetch books:', error)
        this.error = 'Failed to load books. Please try again later.'
        this.showToast(this.error, true)
      } finally {
        this.loading = false
      }
    },
    
    async refreshBooks() {
      const books = await mockstorage.fetchAllBooks()
      if (!books || !books.length) {
        this.error = 'No books available at the moment.'
        return
      }
      this.books = books
      
      // Cache the results
      try {
        sessionStorage.setItem('dashboard_books', JSON.stringify(books))
      } catch (error) {
        console.error('Failed to cache books:', error)
      }
    },

    showToast(message, isError = false) {
      const toast = document.createElement('div')
      toast.textContent = message
      toast.style.position = 'fixed'
      toast.style.top = '20px'
      toast.style.right = '20px'
      toast.style.padding = '12px 24px'
      toast.style.borderRadius = '4px'
      toast.style.backgroundColor = isError ? '#dc3545' : '#28a745'
      toast.style.color = 'white'
      toast.style.zIndex = '9999'
      
      document.body.appendChild(toast)
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 3000)
    }
  },

 async mounted() {
    await this.fetchBooks()
    this.updateCartCount() // Initial cart count update

    // Listen for cart updates from other components
    window.addEventListener('cart-updated', (event) => {
      this.cartCount = event.detail
    })
  },

  beforeUnmount() {
    // Store the callback reference so it can be removed properly
    const cartUpdateHandler = (event) => {
      this.cartCount = event.detail
    }
    window.removeEventListener('cart-updated', cartUpdateHandler)
  }
}
</script>

<style scoped>
.hero {
  background-color: whitesmoke;
}

.spinner-container {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  transition: transform 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
</style>