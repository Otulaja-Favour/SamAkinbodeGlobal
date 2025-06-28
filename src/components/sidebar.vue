<template>
  <aside class="asideBar">
    <div
      v-for="item in sidebarItems"
      :key="item.tab"
      @click="$emit('tab-change', item.tab)"
      class="sidebar-item"
      :class="{ active: activeTab === item.tab }"
    >
      <i :class="item.icon"></i>
      <span class="sidebar-label">{{ item.label }}</span>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'DashboardSidebar',
  props: {
    activeTab: {
      type: String,
      required: true
    }
  },
  emits: ['tab-change'],
  data() {
    return {
      sidebarItems: [
        { tab: 'overview', label: 'Overview', icon: 'fas fa-chart-bar' },
        { tab: 'books', label: 'My Books', icon: 'fas fa-book' },
        { tab: 'rentals', label: 'My Rentals', icon: 'fas fa-calendar-alt' },
        { tab: 'transactions', label: 'Transactions', icon: 'fas fa-receipt' },
        { tab: 'appointments', label: 'Appointments', icon: 'fas fa-calendar-plus' },
        { tab: 'settings', label: 'Settings', icon: 'fas fa-cog' },
      ]
    }
  }
}
</script>

<style scoped>
.asideBar {
  width: 250px;
  min-width: 180px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafbfc;
  padding: 10px;
  height: fit-content;
}

.sidebar-item {
  margin: 0px 8px;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
}

.sidebar-item.active,
.sidebar-item:hover {
  background: #0d6efd;
  color: #fff;
}

.sidebar-item i {
  min-width: 20px;
  font-size: 1.1rem;
}

.sidebar-label {
  display: inline-block;
  transition: all 0.2s;
}

@media (max-width: 900px) {
  .asideBar {
    width: 100%;
    min-width: unset;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: stretch;
    padding: 0;
    border-radius: 0;
    border-right: none;
    border-bottom: 1px solid #eee;
    background: #fafbfc;
    padding-bottom: 0;
  }

  .sidebar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0px;
    padding: 10px 4px;
    gap: 0;
    border-radius: 0;
    font-size: 0.95rem;
    width: 100%;
    min-width: unset;
    flex: 1;
  }

  .sidebar-label {
    display: none;
    font-size: 0.8rem;
    margin-top: 3px;
    text-align: center;
  }
}
</style>