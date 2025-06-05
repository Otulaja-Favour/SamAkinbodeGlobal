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
          <button class="btn btn-success" @click="checkout" :disabled="cart.length === 0">
            Proceed to Checkout
          </button>
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
      const user = await mockstorage.fetchUser(this.userId);
      this.userEmail = user?.email || '';
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
    checkout() {
      const email = this.userEmail || this.cart[0]?.email || "test@example.com";
      const amount = this.totalPrice * 100;

      if (!window.PaystackPop) {
        alert('Payment system not loaded. Please check your internet connection.');
        return;
      }

      const handler = window.PaystackPop.setup({
        key: 'pk_test_055ff01887157684e74ac380a88d95b89ad6192f',
        email: email,
        amount: amount,
        currency: "NGN",
        ref: '' + Math.floor(Math.random() * 1000000000 + 1),
        callback: (response) => {
          this.handlePaymentSuccess(response);
        },
        onClose: () => {
          alert('Payment window closed.');
        }
      });
      handler.openIframe();
    },
    async handlePaymentSuccess(response) {
      if (!this.userId) {
        alert('User not found. Please log in again.');
        return;
      }
      const now = new Date().toLocaleString();
      let user = await mockstorage.fetchUser(this.userId);

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
        alert('Failed to save to server. Please try again.');
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

      alert('Payment complete! Reference: ' + response.reference);
    }
  }
};
</script>