```vue
<template>
  <div class="container-fluid p-0">
    <div class="container my-5">
      <h3 class="mb-4">Cart Summary</h3>
      <div v-if="isCartEmpty" class="alert alert-info">
        Your cart is empty.
        <router-link to="/books">
          <button class="btn btn-primary">Browse books</button>
        </router-link>
      </div>
      <div v-else class="table-responsive">
        <table class="table table-bordered align-middle">
          <thead class="table-light">
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Action</th>
              <th>Price (₦)</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in cart" :key="idx">
              <td>
                <img :src="item.image" alt="Book cover" class="cart-img" />
              </td>
              <td>{{ item.title }}</td>
              <td class="text-capitalize">{{ item.action }}</td>
              <td>{{ item.price }}</td>
              <td>
                <button class="btn btn-danger btn-sm" @click="deleteItem(idx)">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="d-flex justify-content-end">
          <h5>
            Total: <span class="text-success">₦{{ totalPrice }}</span>
          </h5>
        </div>
        <div class="d-flex justify-content-end mt-3">
          <button class="btn btn-success" @click="checkoutDirect" :disabled="isCartEmpty">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>

    <!-- Spinner Modal -->
    <div v-if="loading" class="modal-backdrop show" style="z-index: 2000"></div>
    <div
      v-if="loading"
      class="modal d-block"
      tabindex="-1"
      style="z-index: 2050; background: rgba(0, 0, 0, 0.2)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content text-center p-4">
          <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem">
            <span class="visually-hidden">Loading...</span>
          </div>
          <div class="mt-3">Processing, please wait...</div>
        </div>
      </div>
    </div>

    <!-- Feedback Modal (for errors) -->
    <div v-if="showModal" class="modal-backdrop show" style="z-index: 2000"></div>
    <div
      v-if="showModal"
      class="modal d-block"
      tabindex="-1"
      style="z-index: 2050; background: rgba(0, 0, 0, 0.2)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Notification</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <p>{{ modalMessage }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="closeModal">OK</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Confirmation Modal -->
    <div v-if="showOrderModal" class="modal-backdrop show" style="z-index: 2000"></div>
    <div
      v-if="showOrderModal"
      class="modal d-block"
      tabindex="-1"
      style="z-index: 2050; background: rgba(0, 0, 0, 0.2)"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Order Confirmed</h5>
            <button type="button" class="btn-close" @click="closeOrderModal"></button>
          </div>
          <div class="modal-body">
            <p class="text-success">Your order has been confirmed!</p>
            <p><strong>Order placed on:</strong> {{ orderDate }}</p>
            <p><strong>Reference:</strong> {{ orderReference }}</p>
            <p><strong>Total Amount:</strong> ₦{{ totalPrice }}</p>
            <h6>Bought Books</h6>
            <ul
              v-if="orderBooks.filter((b) => b.action === 'buy').length > 0"
              class="list-group mb-3"
            >
              <li
                v-for="book in orderBooks.filter((b) => b.action === 'buy')"
                :key="book.title"
                class="list-group-item d-flex align-items-center"
              >
                <img
                  :src="book.image"
                  alt="Book cover"
                  class="cart-img me-2"
                  style="width: 50px; height: 70px"
                />
                <span>{{ book.title }} - ₦{{ book.price }}</span>
              </li>
            </ul>
            <p v-else>No books bought.</p>
            <h6>Borrowed Books</h6>
            <ul
              v-if="orderBooks.filter((b) => b.action === 'borrow').length > 0"
              class="list-group"
            >
              <li
                v-for="book in orderBooks.filter((b) => b.action === 'borrow')"
                :key="book.title"
                class="list-group-item d-flex align-items-center"
              >
                <img
                  :src="book.image"
                  alt="Book cover"
                  class="cart-img me-2"
                  style="width: 50px; height: 70px"
                />
                <span>{{ book.title }} - ₦{{ book.price }}</span>
              </li>
            </ul>
            <p v-else>No books borrowed.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="closeOrderModal">OK</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import mockstorage from '@/stores/mockstorage'

export default {
  name: 'CartComponent',
  
  data() {
    return {
      cart: [],
      userEmail: '',
      loading: false,
      showModal: false,
      modalMessage: '',
      showOrderModal: false,
      orderBooks: [],
      orderDate: '',
      orderReference: '',
      PAYSTACK_KEY: 'pk_live_f96aa56b0b5b7fb5ba3ee4dd322344e920cd3089'
    }
  },

  computed: {
    isCartEmpty() {
      return this.cart.length === 0
    },

    totalPrice() {
      return this.cart.reduce((sum, item) => sum + Number(item.price || 0), 0)
    }
  },

  methods: {
    async loadCart() {
      try {
        // Load cart from session storage
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
          this.cart = JSON.parse(savedCart)
        }
        
        // Get user email from session
        const email = sessionStorage.getItem('userEmail')
        if (email) {
          this.userEmail = email
        }
      } catch (error) {
        console.error('Failed to load cart:', error)
        this.cart = []
      }
    },

    saveCart() {
      try {
        sessionStorage.setItem('cart', JSON.stringify(this.cart))
      } catch (error) {
        console.error('Failed to save cart:', error)
        this.showModalMessage('Failed to save cart', true)
      }
    },

    deleteItem(index) {
      this.cart.splice(index, 1)
      this.saveCart()
      this.updateCartCount()
    },

    updateCartCount() {
      window.dispatchEvent(new CustomEvent('cart-updated', { 
        detail: this.cart.length 
      }))
    },

    showModalMessage(message, isError = false) {
      this.modalMessage = message
      this.showModal = true
    },

    closeModal() {
      this.showModal = false
      this.modalMessage = ''
    },

    closeOrderModal() {
      this.showOrderModal = false
      this.$router.push('/books')
    },

    checkoutDirect() {
      if (!this.userEmail) {
        this.$router.push('/')
        return
      }

      try {
        const handler = window.PaystackPop.setup({
          key: this.PAYSTACK_KEY,
          email: this.userEmail.trim(),
          amount: Math.round(this.totalPrice * 100),
          currency: 'NGN',
          ref: `BV-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          callback: (response) => {
            this.processPaymentSuccess(response)
          },
          onClose: () => {
            this.showModalMessage('Payment cancelled')
          }
        })

        handler.openIframe()
      } catch (error) {
        console.error('Payment setup failed:', error)
        this.showModalMessage('Payment initialization failed. Please try again.', true)
      }
    },

    async processPaymentSuccess(response) {
      if (!response?.reference) {
        this.showModalMessage('Invalid payment response', true)
        return
      }

      this.loading = true

      try {
        const transactionData = this.cart.map(item => ({
          ...item,
          reference: response.reference,
          date: new Date().toISOString(),
          status: 'completed',
          userEmail: this.userEmail
        }))

        // Save transaction
        await mockstorage.saveTransaction(this.userEmail, transactionData)

        // Process books
        for (const item of this.cart) {
          const bookData = {
            ...item,
            purchaseDate: new Date().toISOString(),
            transactionRef: response.reference,
            userEmail: this.userEmail
          }

          const collectionName = item.action === 'buy' ? 'broughtBook' : 'borrowedBook'
          await mockstorage.saveBook(collectionName, this.userEmail, bookData)
        }

        // Update order information
        this.orderBooks = [...this.cart]
        this.orderDate = new Date().toISOString()
        this.orderReference = response.reference
        
        // Clear cart
        sessionStorage.removeItem('cart')
        this.cart = []
        this.updateCartCount()
        
        // Show confirmation
        this.showOrderModal = true
      } catch (error) {
        console.error('Transaction processing failed:', error)
        this.showModalMessage('Failed to process order. Please contact support.', true)
      } finally {
        this.loading = false
      }
    }
  },

  created() {
    this.loadCart()
    window.addEventListener('user-logged-in', this.loadCart)
  },

  beforeUnmount() {
    this.saveCart()
    window.removeEventListener('user-logged-in', this.loadCart)
  }
}
</script>

<style scoped>
.cart-img {
  width: 70px;
  height: 90px;
  object-fit: cover;
  border-radius: 4px;
}

.list-group-item {
  display: flex;
  align-items: center;
}

.modal {
  background: rgba(0, 0, 0, 0.3);
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>



