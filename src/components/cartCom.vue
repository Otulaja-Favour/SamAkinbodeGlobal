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
            <button class="btn btn-outline-success w-100 mb-2" @click="selectPaymentMethod('bank')">Pay with Bank Transfer</button>
            <button class="btn btn-outline-info w-100" @click="selectPaymentMethod('wallet')">Pay with Wallet</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Details Modal -->
    <div v-if="showPaymentDetailsModal" class="modal-backdrop show" style="z-index: 2000;"></div>
    <div v-if="showPaymentDetailsModal" class="modal d-block" tabindex="-1" style="z-index: 2050; background: rgba(0,0,0,0.2);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Enter Payment Details</h5>
            <button type="button" class="btn-close" @click="closePaymentDetailsModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitPaymentDetails">
              <div class="mb-2">
                <label class="form-label">Name</label>
                <input v-model="paymentForm.name" type="text" class="form-control" required />
              </div>
              <div class="mb-2">
                <label class="form-label">Email</label>
                <input v-model="paymentForm.email" type="email" class="form-control" required />
              </div>
              <div v-if="selectedPaymentMethod === 'card'">
                <div class="mb-2">
                  <label class="form-label">Card Number</label>
                  <input v-model="paymentForm.cardNumber" type="text" class="form-control" maxlength="19" required />
                </div>
                <div class="mb-2 d-flex">
                  <div class="me-2 flex-fill">
                    <label class="form-label">Expiry</label>
                    <input v-model="paymentForm.expiry" type="text" class="form-control" placeholder="MM/YY" required />
                  </div>
                  <div class="flex-fill">
                    <label class="form-label">CVV</label>
                    <input v-model="paymentForm.cvv" type="text" class="form-control" maxlength="4" required />
                  </div>
                </div>
              </div>
              <div v-if="selectedPaymentMethod === 'bank'">
                <div class="mb-2">
                  <label class="form-label">Select Bank</label>
                  <select v-model="paymentForm.selectedBank" class="form-select" required>
                    <option v-for="bank in banks" :key="bank.code" :value="bank.code">{{ bank.name }}</option>
                  </select>
                </div>
                <div class="mb-2">
                  <label class="form-label">Account Number</label>
                  <input v-model="paymentForm.accountNumber" type="text" class="form-control" maxlength="10" required />
                </div>
              </div>
              <div v-if="selectedPaymentMethod === 'wallet'">
                <div class="mb-2">
                  <label class="form-label">Select Wallet</label>
                  <select v-model="paymentForm.selectedWallet" class="form-select" required>
                    <option v-for="wallet in wallets" :key="wallet.id" :value="wallet.id">{{ wallet.name }}</option>
                  </select>
                </div>
                <div class="mb-2">
                  <label class="form-label">Wallet ID</label>
                  <input v-model="paymentForm.walletId" type="text" class="form-control" required />
                </div>
              </div>
              <div class="mb-2">
                <label class="form-label">Pay To</label>
                <select v-model="paymentForm.payTo" class="form-select" required>
                  <option v-for="dest in payDestinations" :key="dest.id" :value="dest.id">{{ dest.name }}</option>
                </select>
              </div>
              <button type="submit" class="btn btn-success w-100">Pay</button>
            </form>
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
      showPaymentDetailsModal: false,
      selectedPaymentMethod: null,
      paymentForm: {
        name: '',
        email: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        selectedBank: '',
        accountNumber: '',
        selectedWallet: '',
        walletId: '',
        payTo: '',
      },
      banks: [
        { code: '044', name: 'Access Bank' },
        { code: '011', name: 'First Bank' },
        { code: '058', name: 'GTBank' },
        { code: '232', name: 'Sterling Bank' },
      ],
      wallets: [
        { id: 'opay', name: 'OPay' },
        { id: 'palmpay', name: 'PalmPay' },
        { id: 'kuda', name: 'Kuda' },
      ],
      payDestinations: [
        { id: 'mainacct', name: 'Main Business Account' },
        { id: 'altacct', name: 'Alternate Account' },
        { id: 'wallet', name: 'Business Wallet' },
      ],
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
      this.resetPaymentForm();
      this.showPaymentDetailsModal = true;
    },
    closePaymentDetailsModal() {
      this.showPaymentDetailsModal = false;
    },
    resetPaymentForm() {
      this.paymentForm = {
        name: '',
        email: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        selectedBank: '',
        accountNumber: '',
        selectedWallet: '',
        walletId: '',
        payTo: '',
      };
    },
    submitPaymentDetails() {
      // Validate form (basic)
      if (!this.paymentForm.name || !this.paymentForm.email || !this.paymentForm.payTo) {
        this.showFeedback('Please fill in all required fields.');
        return;
      }
      if (this.selectedPaymentMethod === 'card' && (!this.paymentForm.cardNumber || !this.paymentForm.expiry || !this.paymentForm.cvv)) {
        this.showFeedback('Please fill in all card details.');
        return;
      }
      if (this.selectedPaymentMethod === 'bank' && (!this.paymentForm.selectedBank || !this.paymentForm.accountNumber)) {
        this.showFeedback('Please fill in all bank details.');
        return;
      }
      if (this.selectedPaymentMethod === 'wallet' && (!this.paymentForm.selectedWallet || !this.paymentForm.walletId)) {
        this.showFeedback('Please fill in all wallet details.');
        return;
      }
      this.showPaymentDetailsModal = false;
      this.checkoutWithForm();
    },
    checkoutWithForm() {
      const email = this.paymentForm.email;
      const amount = this.totalPrice * 100;
      if (!window.PaystackPop) {
        this.showFeedback('Payment system not loaded. Please check your internet connection.');
        return;
      }
      // Map our method to Paystack channels
      let channels = ['card'];
      if (this.selectedPaymentMethod === 'bank') {
        channels = ['bank'];
      } else if (this.selectedPaymentMethod === 'wallet') {
        channels = ['ussd', 'mobile_money', 'wallet'];
      }
      // Add metadata for destination
      const metadata = {
        custom_fields: [
          { display_name: 'Pay To', variable_name: 'pay_to', value: this.paymentForm.payTo },
          { display_name: 'Payer Name', variable_name: 'payer_name', value: this.paymentForm.name },
        ]
      };
      if (this.selectedPaymentMethod === 'bank') {
        metadata.custom_fields.push({ display_name: 'Bank', variable_name: 'bank', value: this.paymentForm.selectedBank });
        metadata.custom_fields.push({ display_name: 'Account Number', variable_name: 'account_number', value: this.paymentForm.accountNumber });
      }
      if (this.selectedPaymentMethod === 'wallet') {
        metadata.custom_fields.push({ display_name: 'Wallet', variable_name: 'wallet', value: this.paymentForm.selectedWallet });
        metadata.custom_fields.push({ display_name: 'Wallet ID', variable_name: 'wallet_id', value: this.paymentForm.walletId });
      }
      const handler = window.PaystackPop.setup({
        key: 'pk_test_055ff01887157684e74ac380a88d95b89ad6192f',
        email: email,
        amount: amount,
        currency: "NGN",
        ref: '' + Math.floor(Math.random() * 1000000000 + 1),
        channels: channels,
        metadata: metadata,
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
      this.$router('/profile')
    }
  }
};
</script>