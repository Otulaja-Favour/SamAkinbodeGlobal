<template>
  <div>
    <h4>Settings</h4>
    <form @submit.prevent="handleSaveSettings" class="mt-3" style="max-width: 400px">
      <div class="mb-3">
        <label class="form-label">First Name</label>
        <input v-model="localUser.firstname" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Last Name</label>
        <input v-model="localUser.lastname" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="localUser.email" type="email" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Age</label>
        <input v-model="localUser.age" type="date" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Phone Number</label>
        <input v-model="localUser.phoneNumber" type="tel" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Role</label>
        <input v-model="localUser.role" type="text" class="form-control" readonly />
      </div>
      <button class="btn btn-primary" type="submit" :disabled="settingsLoading">
        <span v-if="settingsLoading" class="spinner-border spinner-border-sm"></span>
        <span v-else>Save Changes</span>
      </button>
    </form>
    
    <div class="mt-4">
      <h6>Your Details:</h6>
      <p><strong>Name:</strong> {{ user.firstname }} {{ user.lastname }}</p>
      <p><strong>Email:</strong> {{ user.email || 'Not set' }}</p>
      <p><strong>Age:</strong> {{ user.age || 'Not set' }}</p>
      <p><strong>Phone Number:</strong> {{ user.phoneNumber || 'Not set' }}</p>
      <p><strong>Role:</strong> {{ user.role || 'Not set' }}</p>
    </div>
    
    <div class="mt-4">
      <h6>Your Comments:</h6>
      <div v-if="userComments.length === 0" class="alert alert-info">No comments yet.</div>
      <ul class="list-group" style="height: 160px; overflow-y: scroll" v-else>
        <li class="list-group-item" v-for="(comment, idx) in userComments" :key="idx">
          <strong>Book ID: {{ comment.bookId }}</strong>: {{ comment.text }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsSection',
  props: {
    user: {
      type: Object,
      required: true
    },
    userComments: {
      type: Array,
      required: true
    },
    settingsLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['save-settings', 'update-user'],
  data() {
    return {
      localUser: { ...this.user }
    }
  },
  watch: {
    user: {
      handler(newUser) {
        this.localUser = { ...newUser }
      },
      deep: true
    }
  },
  methods: {
    handleSaveSettings() {
      this.$emit('update-user', this.localUser)
      this.$emit('save-settings')
    }
  }
}
</script>