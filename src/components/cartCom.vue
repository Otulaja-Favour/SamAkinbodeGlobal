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
          <h5>Total: <span class="text-success">₦{{ totalPrice }}</span></h5>
        </div>
        <div class="d-flex justify-content-end mt-3">
          <button class="btn btn-success" @click="checkoutDirect" :disabled="isCartEmpty">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>

    <!-- Spinner Modal -->
    <div v-if="loading" class="modal-backdrop show" style="z-index: 2000;"></div>
    <div v-if="loading" class="modal d-block" tabindex="-1" style="z-index: 2050; background: rgba(0,0,0,0.2);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content text-center p-4">
          <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Loading...</span>
          </div>
          <div class="mt-3">Processing, please wait...</div>
        </div>
      </div>
    </div>

    <!-- Feedback Modal (for errors) -->
    <div v-if="showModal" class="modal-backdrop show" style="z-index: 2000;"></div>
    <div v-if="showModal" class="modal d-block" tabindex="-1" style="z-index: 2050; background: rgba(0,0,0,0.2);">
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
    <div v-if="showOrderModal" class="modal-backdrop show" style="z-index: 2000;"></div>
    <div v-if="showOrderModal" class="modal d-block" tabindex="-1" style="z-index: 2050; background: rgba(0,0,0,0.2);">
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
            <ul v-if="orderBooks.filter(b => b.action === 'buy').length > 0" class="list-group mb-3">
              <li v-for="book in orderBooks.filter(b => b.action === 'buy')" :key="book.title" class="list-group-item d-flex align-items-center">
                <img :src="book.image" alt="Book cover" class="cart-img me-2" style="width: 50px; height: 70px;" />
                <span>{{ book.title }} - ₦{{ book.price }}</span>
              </li>
            </ul>
            <p v-else>No books bought.</p>
            <h6>Borrowed Books</h6>
            <ul v-if="orderBooks.filter(b => b.action === 'borrow').length > 0" class="list-group">
              <li v-for="book in orderBooks.filter(b => b.action === 'borrow')" :key="book.title" class="list-group-item d-flex align-items-center">
                <img :src="book.image" alt="Book cover" class="cart-img me-2" style="width: 50px; height: 70px;" />
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
import mockstorage from '@/stores/mockstorage';
import axios from 'axios';

export default {
  name: 'CartCount',
  data() {
    return {
      cart: [],
      userId: localStorage.getItem('userId') || null,
      userEmail: '',
      loading: false,
      showModal: false,
      modalMessage: '',
      showOrderModal: false,
      orderBooks: [],
      orderDate: '',
      orderReference: '',
    };
  },
  computed: {
    isCartEmpty() {
      return this.cart.length === 0;
    },
    totalPrice() {
      return this.cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
    },
  },
  mounted() {
    this.loadCart();
    window.addEventListener('cart-updated', this.loadCart);
    if (this.userId) this.fetchUserData();
  },
  beforeDestroy() {
    window.removeEventListener('cart-updated', this.loadCart);
  },
  methods: {
    loadCart() {
      this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    },
    async fetchUserData() {
      if (!this.userId) {
        this.showFeedback('No user logged in.');
        return;
      }
      this.loading = true;
      try {
        const user = await mockstorage.fetchUser(this.userId);
        this.userEmail = user?.email || '';
        if (!this.userEmail) {
          this.showFeedback('User email not found in database.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        this.showFeedback('Failed to fetch user data.');
      } finally {
        this.loading = false;
      }
    },
    deleteItem(idx) {
      this.cart.splice(idx, 1);
      localStorage.setItem('cart', JSON.stringify(this.cart));
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: this.cart.length }));
    },
    showFeedback(message) {
      this.modalMessage = message;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.modalMessage = '';
    },
    closeOrderModal() {
      this.showOrderModal = false;
      this.orderBooks = [];
      this.orderDate = '';
      this.orderReference = '';
      this.$router.push('/profile'); // Redirect to profile after closing
    },
    async processPaymentSuccess(response) {
      if (!this.userId) {
        this.showFeedback('User not found. Please log in again.');
        return;
      }
      this.loading = true;
      const now = new Date().toLocaleString();
      const processedBooks = [...this.cart]; // Store cart for order modal

      // Prepare data for API and localStorage
      const newBooks = [];
      const newTransactions = [];
      this.cart.forEach((item) => {
        const bookData = { ...item, userId: this.userId };
        if (item.action === 'buy') {
          newBooks.push({ ...bookData, type: 'broughtBook' });
          newTransactions.push({ ...bookData, type: 'transaction', date: now, reference: response.reference });
        } else if (item.action === 'borrow') {
          newBooks.push({ ...bookData, type: 'borrowedBook', rentalDate: now });
          newTransactions.push({ ...bookData, type: 'transaction', date: now, reference: response.reference });
        }
      });

      // Save to API incrementally
      let apiSuccess = true;
      try {
        await mockstorage.updateUser(this.userId, {
          id: this.userId,
          email: this.userEmail,
          lastUpdated: now,
        });
        for (const book of newBooks) {
          try {
            await mockstorage.addBook({ ...book, userId: this.userId });
          } catch (error) {
            console.error(`Error saving book for user ${this.userId}:`, error);
            apiSuccess = false;
          }
        }
        for (const transaction of newTransactions) {
          try {
            if (typeof mockstorage.addTransaction === 'function') {
              await mockstorage.addTransaction({ ...transaction, userId: this.userId });
            } else {
              console.warn('addTransaction not found, using axios fallback');
              await axios.post('https://683efaf01cd60dca33ddd10d.mockapi.io/users', {
                ...transaction,
                userId: this.userId,
                type: 'transaction',
              });
            }
          } catch (error) {
            console.error(`Error saving transaction for user ${this.userId}:`, error);
            apiSuccess = false;
          }
        }
      } catch (error) {
        console.error(`Error updating API for user ${this.userId}:`, error);
        apiSuccess = false;
      }

      // Update localStorage
      const broughtBooks = JSON.parse(localStorage.getItem(`broughtBooks_${this.userId}`) || '[]');
      const borrowedBooks = JSON.parse(localStorage.getItem(`borrowedBooks_${this.userId}`) || '[]');
      let transactionHistory = JSON.parse(localStorage.getItem(`transactionHistory_${this.userId}`) || '[]');
      broughtBooks.push(...newBooks.filter(b => b.type === 'broughtBook'));
      borrowedBooks.push(...newBooks.filter(b => b.type === 'borrowedBook'));
      transactionHistory = [...transactionHistory, ...newTransactions];

      localStorage.setItem(`broughtBooks_${this.userId}`, JSON.stringify(broughtBooks));
      localStorage.setItem(`borrowedBooks_${this.userId}`, JSON.stringify(borrowedBooks));
      localStorage.setItem(`transactionHistory_${this.userId}`, JSON.stringify(transactionHistory));

      // Clear cart
      localStorage.removeItem('cart');
      this.cart = [];
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: 0 }));

      // Show order confirmation
      this.loading = false;
      this.orderBooks = processedBooks;
      this.orderDate = now;
      this.orderReference = response.reference;
      this.showOrderModal = true;
      if (!apiSuccess) {
        this.showFeedback('Some data saved locally due to API issues.');
      }
    },
    handlePaymentSuccess(response) {
      this.processPaymentSuccess(response);
    },
    checkoutDirect() {
      if (!this.userId) {
        this.showFeedback('Please log in to proceed with checkout.');
        return;
      }
      if (!this.userEmail) {
        this.showFeedback('User email not found. Please log in again.');
        return;
      }
      if (!window.PaystackPop) {
        this.showFeedback('Payment system not loaded. Please check your internet connection.');
        return;
      }
      if (typeof this.handlePaymentSuccess !== 'function') {
        this.showFeedback('Payment setup failed. Please try again.');
        return;
      }
      const handler = window.PaystackPop.setup({
        key: 'pk_test_055ff01887157684e74ac380a88d95b89ad6192f',
        email: this.userEmail,
        amount: this.totalPrice * 100,
        currency: 'NGN',
        ref: `${Math.floor(Math.random() * 1000000000 + 1)}`,
        callback: this.handlePaymentSuccess.bind(this),
        onClose: () => this.showFeedback('Payment window closed.'),
      });
      handler.openIframe();
    },
  },
};
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
</style>