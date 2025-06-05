<template>
  <div class="container my-5">
<navBar />

    <!-- Profile Section -->
    <div class="d-flex flex-column align-items-center mb-4">
      <div class="profile-pic mb-2">
        <img :src="user.image || defaultImage" alt="Profile" class="rounded-circle border border-primary" width="120" height="120" />
      </div>
      <h4>{{ user.name }}</h4>
      <button class="btn btn-primary btn-sm mt-2" @click="showEdit = true">
        <i class="fas fa-edit"></i> Edit Profile
      </button>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEdit" class="modal fade show" style="display: block;" @click.self="showEdit = false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Profile</h5>
            <button type="button" class="btn-close" @click="showEdit = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveProfile">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input v-model="editUser.name" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="editUser.email" type="email" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Upload Profile Image</label>
                <input type="file" @change="handleImageUpload" accept="image/*" class="form-control" />
                <div v-if="editUser.image" class="mt-2">
                  <img :src="editUser.image" alt="Preview" class="rounded" width="100" height="100" />
                </div>
              </div>
              <button class="btn btn-success" type="submit">Save</button>
            </form>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show"></div>
    </div>

    <!-- Overview Section -->
    <div class="list-group mt-4">
      <a href="#" class="list-group-item list-group-item-action d-flex align-items-center">
        <i class="fas fa-user-circle me-3"></i> Overview
      </a>
      <a href="#" class="list-group-item list-group-item-action d-flex align-items-center">
        <i class="fas fa-book me-3"></i> My Books
      </a>
      <a href="#" class="list-group-item list-group-item-action d-flex align-items-center">
        <i class="fas fa-book-reader me-3"></i> My Rentals
      </a>
      <a href="#" class="list-group-item list-group-item-action d-flex align-items-center">
        <i class="fas fa-exchange-alt me-3"></i> Transactions
      </a>
      <a href="#" class="list-group-item list-group-item-action d-flex align-items-center">
        <i class="fas fa-calendar-alt me-3"></i> Appointments
      </a>
      <a href="#" class="list-group-item list-group-item-action d-flex align-items-center">
        <i class="fas fa-cog me-3"></i> Settings
      </a>
    </div>
  </div>
</template>

<script>
import navBar from './navBar.vue';
export default {
    component: {navBar},
  data() {
    return {
      user: {
        name: "John Doe",
        email: "john@example.com",
        image: ""
      },
      editUser: {
        name: "",
        email: "",
        image: ""
      },
      showEdit: false,
      defaultImage: "https://via.placeholder.com/120x120.png?text=Profile"
    };
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.editUser.image = URL.createObjectURL(file); // Show preview
        // Optionally: upload to server or store in base64/localStorage here
      }
    },
    saveProfile() {
      this.user = { ...this.editUser };
      this.showEdit = false;
    }
  },
  watch: {
    showEdit(val) {
      if (val) {
        this.editUser = { ...this.user };
      }
    }
  }
};
</script>

<style scoped>
.profile-pic img {
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #0d6efd;
}
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  z-index: 1040;
}
</style>
