<template>
  <div class="container-fluid p-0">
    <!-- Debug Section -->
    <div class="container my-5">
      <h3 class="mb-4">Cart Summary</h3>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading cart...</span>
        </div>
        <p class="mt-2">Loading your cart...</p>
      </div>
      
      <!-- Empty Cart State -->
      <div v-else-if="isCartEmpty" class="alert alert-info">
        <div class="d-flex align-items-center">
          <i class="fas fa-shopping-cart fa-2x me-3 text-muted"></i>
          <div>
            <h5 class="mb-1">Your cart is empty</h5>
            <p class="mb-2">Add some books to get started!</p>
            <router-link to="/books">
              <button class="btn btn-primary">Browse Books</button>
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- Cart Items Table -->
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
            <tr v-for="(item, idx) in cart" :key="`cart-${idx}-${item.id || idx}`">
              <td>
                <!-- <img 
                  :src="getImageUrl(item.image)" 
                  alt="Book cover" 
                  class="cart-img"
                  @error="handleImageError"
                /> -->
              </td>
              <td>{{ item.title || 'Unknown Title' }}</td>
              <td class="text-capitalize">
                <span class="badge" :class="item.action === 'buy' ? 'bg-success' : 'bg-info'">
                  {{ item.action || 'buy' }}
                </span>
              </td>
              <td>₦{{ formatPrice(item.price) }}</td>
              <td>
                <button class="btn btn-danger btn-sm" @click="deleteItem(idx)" :disabled="loading">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Cart Summary -->
        <div class="d-flex justify-content-between align-items-center mt-3">
          <div>
            <small class="text-muted">{{ cart.length }} item(s) in cart</small>
          </div>
          <div>
            <h5 class="mb-0">
              Total: <span class="text-success">₦{{ formatPrice(totalPrice) }}</span>
            </h5>
          </div>
        </div>
        
        <!-- Cart Actions -->
        <div class="d-flex justify-content-end mt-3 gap-2">
          <button 
            class="btn btn-outline-secondary" 
            @click="clearCart"
            :disabled="loading"
          >
            Clear Cart
          </button>
          <button 
            class="btn btn-success" 
            @click="checkoutDirect" 
            :disabled="isCartEmpty || loading"
          >
            <i class="fas fa-credit-card me-2"></i>
            {{ loading ? 'Processing...' : 'Proceed to Checkout' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Modal -->
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
          <div class="mt-3">Processing payment, please wait...</div>
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
            <h5 class="modal-title">
              <i class="fas fa-check-circle text-success me-2"></i>
              Order Confirmed
            </h5>
            <button type="button" class="btn-close" @click="closeOrderModal"></button>
          </div>
          <div class="modal-body">
            <div class="text-center mb-3">
              <i class="fas fa-check-circle text-success" style="font-size: 3rem;"></i>
            </div>
            <p class="text-success text-center"><strong>Your order has been confirmed!</strong></p>
            
            <!-- Order Details -->
            <div class="row">
              <div class="col-md-6">
                <p><strong>Order Date:</strong> {{ formatDate(orderDate) }}</p>
                <p><strong>Reference:</strong> <code>{{ orderReference }}</code></p>
              </div>
              <div class="col-md-6">
                <p><strong>Total Amount:</strong> <span class="text-success">₦{{ formatPrice(orderTotal) }}</span></p>
                <p><strong>Items:</strong> {{ orderBooks.length }} book(s)</p>
              </div>
            </div>
            
            <!-- Purchased Books -->
            <div v-if="orderBooks.filter((b) => b.type === 'buy').length > 0">
              <h6 class="mt-3">📚 Purchased Books</h6>
              <div class="row">
                <div 
                  v-for="book in orderBooks.filter((b) => b.type === 'buy')" 
                  :key="`bought-${book.bookId}`"
                  class="col-md-6 mb-2"
                >
                  <div class="d-flex align-items-center border rounded p-2">
                    <img
                      :src="getImageUrl(book.image)"
                      alt="Book cover"
                      class="me-2"
                      style="width: 40px; height: 50px; object-fit: cover; border-radius: 4px;"
                    />
                    <div>
                      <small class="fw-bold">{{ book.title }}</small><br>
                      <small class="text-success">₦{{ formatPrice(book.price) }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Borrowed Books -->
            <div v-if="orderBooks.filter((b) => b.type === 'borrow').length > 0">
              <h6 class="mt-3">📖 Borrowed Books (14 days)</h6>
              <div class="row">
                <div 
                  v-for="book in orderBooks.filter((b) => b.type === 'borrow')" 
                  :key="`borrowed-${book.bookId}`"
                  class="col-md-6 mb-2"
                >
                  <div class="d-flex align-items-center border rounded p-2">
                    <img
                      :src="getImageUrl(book.image)"
                      alt="Book cover"
                      class="me-2"
                      style="width: 40px; height: 50px; object-fit: cover; border-radius: 4px;"
                    />
                    <div>
                      <small class="fw-bold">{{ book.title }}</small><br>
                      <small class="text-info">₦{{ formatPrice(book.price) }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success" @click="goToProfile">
              <i class="fas fa-user me-2"></i>View My Books
            </button>
            <button type="button" class="btn btn-primary" @click="closeOrderModal">
              <i class="fas fa-shopping-cart me-2"></i>Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mockstorage from '@/stores/mockstorage'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
// import PaystackPop from 'paystack-pop'; // Declare PaystackPop variable

export default {
  name: 'CartComponent',
  
  data() {
    return {
      cart: [],
      userEmail: '',
      userId: '',
      userData: null,
      loading: false,
      isLoading: false,
      showOrderModal: false,
      orderBooks: [],
      orderDate: '',
      orderReference: '',
      orderTotal: 0,
      PAYSTACK_KEY: 'pk_test_e8011d0aec4bd45296062e3d5675cb7fcb9be5cd',
    }
  },

  computed: {
    isCartEmpty() {
      return !this.cart || this.cart.length === 0
    },
    totalPrice() {
      return this.cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0)
    }
  },

  methods: {
    // Utility Methods
    getImageUrl(image) {
      if (!image) return '/placeholder-book.jpg'
      if (image.startsWith('http')) return image
      return `/images/${image}`
    },

    handleImageError(event) {
      event.target.src = '/placeholder-book.jpg'
    },

    formatPrice(price) {
      return Number(price).toLocaleString('en-NG')
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    // Cart Loading Methods
    async loadCart() {
      if (this.isLoading) return
      
      try {
        this.isLoading = true
        
        // Get user data from session storage
        const userDataStr = sessionStorage.getItem('userData')
        if (!userDataStr) {
          console.log('No user data in session storage')
          this.$router.push('/')
          return
        }

        this.userData = JSON.parse(userDataStr)
        this.userEmail = this.userData.email
        this.userId = this.userData.id

        // Load cart from session storage first
        const sessionCart = sessionStorage.getItem('cart')
        if (sessionCart) {
          this.cart = JSON.parse(sessionCart)
        }

   

        this.updateCartCount()
      } catch (error) {
        console.error('Cart load failed:', error)
        toast.error('Failed to load cart')
      } finally {
        this.isLoading = false
      }
    },

    // Cart Operations
    async deleteItem(index) {
      try {
        this.cart.splice(index, 1)
        await this.syncCart()
        toast.success('Item removed from cart')
      } catch (error) {
        console.error('Delete item failed:', error)
        toast.error('Failed to remove item')
      }
    },

    async clearCart() {
      try {
        this.cart = []
        sessionStorage.removeItem('cart')
        if (this.userId) {
          // await mockstorage.saveUserCart(this.userId, [])
        }
        this.updateCartCount()
        toast.success('Cart cleared')
      } catch (error) {
        console.error('Clear cart failed:', error)
        toast.error('Failed to clear cart')
      }
    },

    // async syncCart() {
    //   try {
    //     // sessionStorage.setItem('cart', JSON.stringify(this.cart))
    //     if (this.userId) {
    //       // await mockstorage.saveUserCart(this.userId, this.cart)
    //     }
    //     this.updateCartCount()
    //   } catch (error) {
    //     console.error('Cart sync failed:', error)
    //     toast.error('Failed to sync cart')
    //   }
    // },

    // Checkout Methods
    async checkoutDirect() {
      if (this.loading) return
      
      try {
        this.loading = true
        
        if (!this.userData || !this.userId) {
          this.loading = false
          toast.error('Please login to checkout')
          return
        }

        if (this.isCartEmpty) {
          this.loading = false
          toast.error('Your cart is empty')
          return
        }

        const paymentData = {
          email: this.userEmail,
          amount: this.totalPrice * 100, // Paystack expects amount in kobo
          reference: `ORDER_${Date.now()}_${this.userId}`,
          metadata: {
            userId: this.userId,
            cartItems: this.cart.map(item => ({
              id: item.id,
              title: item.title,
              price: item.price,
              action: item.action
            }))
          }
        }

        const handler = PaystackPop.setup({
          key: this.PAYSTACK_KEY,
          email: paymentData.email,
          amount: paymentData.amount,
          ref: paymentData.reference,
          metadata: paymentData.metadata,
          callback: (response) => {
            this.processPaymentSuccess(response)
          },
          onClose: () => {
            this.loading = false
            toast.info('Payment window closed')
          }
        })

        handler.openIframe()
      } catch (error) {
        console.error('Checkout failed:', error)
        toast.error('Checkout failed. Please try again.')
        this.loading = false
      }
    },

    async processPaymentSuccess(response) {
      try {
        this.loading = true
        
        if (!this.userId || !this.userData) {
          throw new Error('Missing user data')
        }

        if (!this.cart.length) {
          throw new Error('Cart is empty')
        }

        // Process purchase using the mockstorage service
        const result = await mockstorage.processPurchase(
          this.userId, 
          this.cart, 
          response.reference
        )

        if (result.success) {
          // Update local user data
          this.userData = result.user
          sessionStorage.setItem('userData', JSON.stringify(result.user))

          // Clear cart
          this.cart = []
          sessionStorage.removeItem('cart')

          // Set order confirmation data
          this.orderDate = result.transaction.date
          this.orderReference = response.reference
          this.orderTotal = this.totalPrice
          this.orderBooks = result.transaction.items

          // Show success modal
          this.showOrderModal = true
          toast.success('Payment successful!')

          // Emit event for other components
          window.dispatchEvent(new CustomEvent('user-data-updated', {
            detail: result.user
          }))
        }
      } catch (error) {
        console.error('Payment processing failed:', error)
        toast.error('Transaction completed but failed to save')
      } finally {
        this.loading = false
      }
    },

    // UI Methods
    updateCartCount() {
      const count = this.cart.length
      window.dispatchEvent(new CustomEvent('cart-updated', { 
        detail: count 
      }))
    },

    goToProfile() {
      this.$router.push('/profile')
    },

    closeOrderModal() {
      this.showOrderModal = false
      this.$router.push('/books')
    }
  },

  async created() {
    await this.loadCart()
  },

  mounted() {
    // Listen for cart updates from other components
    // window.addEventListener('cart-updated', this.loadCart)
    // window.addEventListener('user-logged-in', (event) => {
    //   this.userId = event.detail.id
    //   this.userData = event.detail
    //   this.userEmail = event.detail.email
    //   this.loadCart()
    // })
  },

  beforeUnmount() {
    // window.removeEventListener('cart-updated', this.loadCart)
    // this.syncCart()
  }
}
</script>

<style scoped>
.cart-img {
  width: 70px;
  height: 90px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
}

.badge {
  font-size: 0.75rem;
}

.modal {
  background: rgba(0, 0, 0, 0.3);
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.modal-content {
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  border-bottom: 1px solid #dee2e6;
  background-color: #f8f9fa;
  border-radius: 10px 10px 0 0;
}

.modal-footer {
  border-top: 1px solid #dee2e6;
  background-color: #f8f9fa;
  border-radius: 0 0 10px 10px;
}

.alert {
  border-radius: 8px;
}

@media (max-width: 768px) {
  .cart-img {
    width: 50px;
    height: 65px;
  }
  
  .table-responsive {
    font-size: 0.9rem;
  }
  
  .modal-dialog {
    margin: 10px;
  }
  
  .container {
    padding: 0 15px;
  }
}
</style>
