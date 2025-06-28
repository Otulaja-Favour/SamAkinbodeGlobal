<template>
  <div>
    <h4>Welcome back, {{ user.firstname || 'User' }}!</h4>
    <div class="row mt-4">
      <div class="col-md-3 mb-3">
        <div class="card text-center clickable" @click="$emit('tab-change', 'books')">
          <div class="card-body">
            <i class="fas fa-book fa-2x text-primary mb-2"></i>
            <h5 class="card-title">{{ user.broughtBooks?.length || 0 }}</h5>
            <p class="card-text">Books Owned</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="card text-center clickable" @click="$emit('tab-change', 'rentals')">
          <div class="card-body">
            <i class="fas fa-book-reader fa-2x text-success mb-2"></i>
            <h5 class="card-title">{{ user.borrowedBooks?.length || 0 }}</h5>
            <p class="card-text">Books Rented</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="card text-center clickable" @click="$emit('tab-change', 'transactions')">
          <div class="card-body">
            <i class="fas fa-receipt fa-2x text-info mb-2"></i>
            <h5 class="card-title">{{ user.transactionHistory?.length || 0 }}</h5>
            <p class="card-text">Total Transactions</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="card text-center">
          <div class="card-body">
            <i class="fas fa-layer-group fa-2x text-warning mb-2"></i>
            <h5 class="card-title">{{ totalBooks }}</h5>
            <p class="card-text">Total Books</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OverviewSection',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  emits: ['tab-change'],
  computed: {
    totalBooks() {
      const owned = this.user.broughtBooks?.length || 0
      const rented = this.user.borrowedBooks?.length || 0
      return owned + rented
    }
  }
}
</script>

<style scoped>
.clickable {
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.clickable:hover {
  box-shadow: 0 2px 12px rgba(13, 110, 253, 0.15);
}
</style>