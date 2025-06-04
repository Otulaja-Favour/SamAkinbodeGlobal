<template>
  <div class="container-fluid p-0">
    <div class="container my-5">
      <h3 class="mb-4">Cart Summary</h3>
      <div v-if="cart.length === 0" class="alert alert-info">
        Your cart is empty.
<router-link to="/books"><button class="btn btn-primary">Browse books</button></router-link>
      </div>
      <div v-else>
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
                  <i class="fas fa-trash"></i> Delete
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
export default {
  data() {
    return {
      cart: JSON.parse(localStorage.getItem('cart')) || [],
    };
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
    },
  },
  mounted() {
    window.addEventListener('cart-updated', this.updateCart);
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
      // Optionally, update cart badge everywhere
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: this.cart.length }));
    },
    checkout() {
      alert('Checkout successful! (Implement your logic here)');
      localStorage.removeItem('cart');
      this.cart = [];
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: 0 }));
    }
  }
};
</script>