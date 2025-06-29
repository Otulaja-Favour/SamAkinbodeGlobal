<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/admin">
        <i class="fas fa-user-shield"></i> Admin Panel
      </RouterLink>
      
      
      <!-- Desktop Navigation -->
      <div class="navbar-nav d-none d-lg-flex flex-row ms-auto">
        <button
          v-for="item in navItems"
          :key="item.tab"
          class="nav-link btn btn-link text-white"
          :class="{ active: activeTab === item.tab, disabled: loadingTab === item.tab }"
          @click="$emit('tab-changed', item.tab)"
          :disabled="loadingTab === item.tab"
        >
          <span v-if="loadingTab === item.tab" class="spinner-border spinner-border-sm me-1"></span>
          <i :class="item.icon" class="me-1"></i>
          {{ item.label }}
        </button>
      </div>
      
      <!-- Mobile Navigation -->
      <div class="navbar-nav d-flex d-lg-none flex-row ms-auto">
        <button
          v-for="item in navItems"
          :key="item.tab"
          class="nav-link btn btn-link text-white p-2"
          :class="{ active: activeTab === item.tab }"
          @click="$emit('tab-changed', item.tab)"
          :disabled="loadingTab === item.tab"
        >
          <i :class="item.icon"></i>
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AdminNavigation',
  props: {
    activeTab: { type: String, required: true },
    loadingTab: { type: String, default: '' }
  },
  emits: ['tab-changed'],
  data() {
    return {
      navItems: [
        { tab: 'overview', label: 'Overview', icon: 'fas fa-chart-bar' },
        { tab: 'books', label: 'Books', icon: 'fas fa-book' },
        { tab: 'users', label: 'Users', icon: 'fas fa-users' },
        { tab: 'transactions', label: 'Transactions', icon: 'fas fa-receipt' },
        { tab: 'profile', label: 'Profile', icon: 'fas fa-user-cog' }
      ]
    }
  }
}
</script>

<style scoped>
.navbar-brand {
  font-weight: bold;
  font-size: 1.3rem;
}

.nav-link {
  border: none;
  background: none;
  margin: 0 5px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: bold;
}

@media (max-width: 991.98px) {
  .nav-link {
    margin: 0 2px;
    padding: 8px;
    font-size: 1.2rem;
  }
  
}
</style>
