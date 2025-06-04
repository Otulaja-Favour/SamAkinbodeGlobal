<template>
  <div class="container-fluid p-0">
    <!-- Desktop Navbar -->
    <nav class="navbar navbar-expand-lg navbar-custom d-none d-lg-flex">
      <div class="container-fluid">
        <RouterLink class="navbar-brand" to="#">
          <i class="fas fa-book-open"></i> BookVault
        </RouterLink>
        <div class="navbar-nav">
          <RouterLink class="nav-link" to="/dashboard"><i class="fas fa-home"></i> Home</RouterLink>
          <RouterLink class="nav-link" to="/books"><i class="fas fa-book"></i> Books</RouterLink>
          <RouterLink class="nav-link" to="/cart"><i class="fas fa-shopping-cart"></i> Cart</RouterLink>
          <RouterLink class="nav-link" to="/profile"><i class="fas fa-user"></i> Profile</RouterLink>
          <RouterLink class="nav-link" to="/logout"><i class="fas fa-sign-out-alt"></i> Logout</RouterLink>
        </div>
      </div>
    </nav>

    <!-- Mobile Navbar fixed at the bottom -->
    <nav class="navbar navbar-mobile d-flex d-lg-none">
      <div class="navbar-nav d-flex flex-row w-100 justify-content-around">
        <RouterLink class="nav-link" to="/dashboard"><i class="fas fa-home"></i><span>Home</span></RouterLink>
        <RouterLink class="nav-link" to="/books"><i class="fas fa-book"></i><span>Books</span></RouterLink>
        <RouterLink class="nav-link" to="/cart"><i class="fas fa-shopping-cart"></i><span>Cart</span></RouterLink>
        <RouterLink class="nav-link" to="/profile"><i class="fas fa-user"></i><span>Profile</span></RouterLink>
        <RouterLink class="nav-link" to="/logout"><i class="fas fa-sign-out-alt"></i><span>Logout</span></RouterLink>
      </div>
    </nav>



 <div class="container my-5">
      <h3 class="mb-4">Cart Summary</h3>
      <div v-if="cart.length === 0" class="alert alert-info">
        Your cart is empty.
      </div>
      <div v-else>
        <table class="table table-bordered align-middle">
          <thead class="table-light">
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Action</th>
              <th>Price (₦)</th>
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
            </tr>
          </tbody>
        </table>
        <div class="d-flex justify-content-end">
          <h5>Total: <span class="text-success">₦{{ totalPrice }}</span></h5>
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
};
</script>

<style scoped>
.navbar-custom {
  background-color: #2c3e50;
  padding: 10px 20px;
}
.navbar-brand {
  color: #ffffff !important;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  display: flex;
  align-items: center;
}
.navbar-brand i {
  margin-right: 8px;
}
.nav-link {
  color: #ffffff !important;
  margin-left: 15px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: color 0.2s;
}
.nav-link i {
  margin-right: 5px;
}
.nav-link:hover {
  color: #3498db !important;
}
@media (max-width: 991.98px) {
  .navbar-custom {
    display: none !important;
  }
  .navbar-mobile {
    display: flex !important;
    justify-content: space-around;
    align-items: center;
    background-color: #2c3e50;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    padding: 10px 0;
    z-index: 1000;
  }
  .navbar-mobile .nav-link {
    color: #ffffff !important;
    margin: 0;
    flex-direction: column;
    font-size: 0.9rem;
    text-align: center;
    padding: 0 4px;
  }
  .navbar-mobile .nav-link i {
    margin-right: 0;
    font-size: 1.3rem;
    display: block;
  }
  .navbar-mobile .nav-link span {
    font-size: 0.75rem;
    margin-top: 2px;
    display: block;
  }
}
@media (min-width: 992px) {
  .navbar-mobile {
    display: none !important;
  }
}
</style>