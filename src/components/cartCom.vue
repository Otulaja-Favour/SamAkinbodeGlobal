<template>
  <div class="container-fluid p-0">
    <div class="container my-5">
      <h3 class="mb-4">Cart Summary</h3>
      <div v-if="cart.length === 0" class="alert alert-info">
        Your cart is empty.
        <router-link to="/books"><button class="btn btn-primary">Browse books</button></router-link>
      </div>
      <div class="table-responsive" v-else>
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
                <img :src="item.image" alt="Book cover" style="width: 70px; height: 90px; object-fit: cover; border-radius: 4px;" />
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
          <button class="btn btn-success" @click="openPaymentMethodModal" :disabled="cart.length === 0">
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

    <!-- Feedback Modal -->
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

    <!-- Payment Method Modal -->
    <div v-if="showPaymentMethodModal" class="modal-backdrop show" style="z-index: 2000;"></div>
    <div v-if="showPaymentMethodModal" class="modal d-block" tabindex="-1" style="z-index: 2050; background: rgba(0,0,0,0.2);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Select Payment Method</h5>
            <button type="button" class="btn-close" @click="closePaymentMethodModal"></button>
          </div>
          <div class="modal-body">
            <button class="btn btn-outline-primary w-100 mb-2" @click="selectPaymentMethod('card')">Pay with Card</button>
            <button class="btn btn-outline-success w-100" @click="selectPaymentMethod('bank')">Pay with Bank Transfer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import mockstorage from '@/stores/mockstorage';

export default {
  data() {
    return {
      cart: JSON.parse(localStorage.getItem('cart')) || [],
      userId: localStorage.getItem('userId') || null,
      userEmail: '',
      loading: false,
      showModal: false,
      modalMessage: '',
      showPaymentMethodModal: false,
      selectedPaymentMethod: null,
    };
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
    },
  },
  async mounted() {
    window.addEventListener('cart-updated', this.updateCart);
    if (this.userId) {
      this.loading = true;
      try {
        const user = await mockstorage.fetchUser(this.userId);
        this.userEmail = user?.email || '';
      } catch (e) {
        this.showFeedback('Failed to fetch user data.');
      } finally {
        this.loading = false;
      }
    }
  },
  beforeUnmount() {
    window.removeEventListener('cart-updated', this.updateCart);
  },
  methods: {
    updateCart() {
      this.cart = JSON.parse(localStorage.getItem('cart')) || [];
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
    openPaymentMethodModal() {
      this.showPaymentMethodModal = true;
    },
    closePaymentMethodModal() {
      this.showPaymentMethodModal = false;
    },
    selectPaymentMethod(method) {
      this.selectedPaymentMethod = method;
      this.showPaymentMethodModal = false;
      this.checkout();
    },
    checkout() {
      const email = this.userEmail || this.cart[0]?.email || "test@example.com";
      const amount = this.totalPrice * 100;

      if (!window.PaystackPop) {
        this.showFeedback('Payment system not loaded. Please check your internet connection.');
        return;
      }

      // Map our method to Paystack channels
      let channels = ['card'];
      if (this.selectedPaymentMethod === 'bank') {
        channels = ['bank'];
      }

      const handler = window.PaystackPop.setup({
        key: 'pk_test_055ff01887157684e74ac380a88d95b89ad6192f',
        email: email,
        amount: amount,
        currency: "NGN",
        ref: '' + Math.floor(Math.random() * 1000000000 + 1),
        channels: channels,
        callback: (response) => {
          this.handlePaymentSuccess(response);
        },
        onClose: () => {
          this.showFeedback('Payment window closed.');
        }
      });
      handler.openIframe();
    },
    async handlePaymentSuccess(response) {
      if (!this.userId) {
        this.showFeedback('User not found. Please log in again.');
        return;
      }
      this.loading = true;
      const now = new Date().toLocaleString();
      let user;
      try {
        user = await mockstorage.fetchUser(this.userId);
      } catch (e) {
        this.loading = false;
        this.showFeedback('Failed to fetch user data.');
        return;
      }

      // Prepare arrays if not present
      if (!user.broughtBooks) user.broughtBooks = [];
      if (!user.borrowedBooks) user.borrowedBooks = [];
      if (!user.transactionHistory) user.transactionHistory = [];

      this.cart.forEach(item => {
        const bookData = {
          ...item,
          userId: this.userId,
        };
        if (item.action === 'buy') {
          user.broughtBooks.push(bookData);
          user.transactionHistory.push({
            ...bookData,
            type: 'buy',
            date: now,
            reference: response.reference
          });
        } else if (item.action === 'borrow') {
          user.borrowedBooks.push(bookData);
          user.transactionHistory.push({
            ...bookData,
            type: 'borrow',
            date: now,
            reference: response.reference
          });
        }
      });

      // Save updated user to API
      try {
        await mockstorage.updateUser(this.userId, user);
      } catch (e) {
        this.loading = false;
        this.showFeedback('Failed to save to server. Please try again.');
        return;
      }

      // Optionally: Save to localStorage (per user, if needed)
      localStorage.setItem(`broughtBooks_${this.userId}`, JSON.stringify(user.broughtBooks));
      localStorage.setItem(`borrowedBooks_${this.userId}`, JSON.stringify(user.borrowedBooks));
      localStorage.setItem(`transactionHistory_${this.userId}`, JSON.stringify(user.transactionHistory));

      // Clear cart
      localStorage.removeItem('cart');
      this.cart = [];
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: 0 }));

      this.loading = false;
      this.showFeedback('Payment complete! Reference: ' + response.reference);
    }
  }
};
</script>