<template>
  <div>
    <!-- Books Management -->
    <div v-if="activeSection === 'books'">
      <h3 class="mb-4">Manage Book Store</h3>
      <div class="d-flex flex-wrap gap-2 mb-3 align-items-center">
        <input
          v-model="bookSearch"
          class="form-control"
          style="max-width: 200px"
          placeholder="Search book..."
        />
        <input
          v-model="bookDateFilter"
          type="date"
          class="form-control"
          style="max-width: 170px"
        />
        <button
          class="btn btn-success"
          @click="openBookModal('add')"
          :disabled="bookFormLoading"
        >
          <span v-if="bookFormLoading" class="spinner-border spinner-border-sm"></span>
          <span v-else>Add Book</span>
        </button>
      </div>

      <!-- Books Table -->
      <div v-if="filteredBooks.length === 0" class="alert alert-info mt-3">No books found.</div>
      <div class="table-responsive" v-else>
        <table class="table table-bordered table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Buy</th>
              <th>Rent</th>
              <th>Description</th>
              <th>Image</th>
              <th>File</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in filteredBooks" :key="book.id">
              <td>{{ book.title }}</td>
              <td>{{ book.author }}</td>
              <td>₦{{ book.price }}</td>
              <td>₦{{ book.rent }}</td>
              <td>
                {{ book.description ? book.description.slice(0, 100) : 'No description' }}
                <span v-if="book.description && book.description.length > 100">...</span>
              </td>
              <td>
                <img
                  v-if="book.image"
                  :src="book.image"
                  alt="Book"
                  style="width: 40px; height: 40px; object-fit: cover"
                />
              </td>
              <td>
                <a v-if="book.pdfUrl" :href="book.pdfUrl" target="_blank" class="badge bg-info">
                  File Link
                </a>
              </td>
              <td>{{ formatDate(book.dateAdded) }}</td>
              <td>
                <button
                  class="btn btn-primary btn-sm me-1"
                  @click="editBook(book)"
                  :disabled="bookFormLoading"
                >
                  Edit
                </button>
                <button
                  class="btn btn-danger btn-sm"
                  @click="askDeleteBook(book.id)"
                  :disabled="bookFormLoading || deletingBookId === book.id"
                >
                  <span
                    v-if="deletingBookId === book.id"
                    class="spinner-border spinner-border-sm"
                  ></span>
                  <span v-else>Delete</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Book Modal -->
      <div v-if="showBookModal" class="modal-backdrop-custom">
        <div class="modal-custom" style="width: 90%; max-width: 800px;">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalMode === 'edit' ? 'Edit Book' : 'Add Book' }}</h5>
            <button type="button" class="btn-close" @click="closeBookModal"></button>
          </div>
          <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
            <form @submit.prevent="addOrUpdateBook">
              <div class="mb-2 d-flex gap-2">
                <input
                  v-model="bookForm.title"
                  type="text"
                  class="form-control"
                  placeholder="Title"
                  required
                />
                <input
                  v-model="bookForm.author"
                  type="text"
                  class="form-control"
                  placeholder="Author"
                  required
                />
              </div>
              <div class="mb-2 d-flex gap-2">
                <input
                  v-model.number="bookForm.price"
                  type="number"
                  class="form-control"
                  placeholder="Buy Amount (₦)"
                  required
                />
                <input
                  v-model.number="bookForm.rent"
                  type="number"
                  class="form-control"
                  placeholder="Rent Amount (₦)"
                  required
                />
              </div>
              <div class="mb-2">
                <textarea
                  v-model="bookForm.description"
                  class="form-control"
                  rows="4"
                  placeholder="Description"
                  required
                ></textarea>
              </div>
              <div class="mb-2">
                <label class="form-label">Cover Image</label>
                <input
                  type="file"
                  class="form-control"
                  accept="image/*"
                  @change="handleImageUpload"
                />
                <div v-if="bookForm.image" class="mt-2">
                  <img
                    :src="bookForm.image"
                    alt="Preview"
                    style="max-width: 120px; max-height: 100px; object-fit: cover"
                  />
                </div>
              </div>
              <div class="mb-2">
                <input
                  v-model="bookForm.pdfUrl"
                  type="url"
                  class="form-control"
                  placeholder="Book File URL (PDF, Google Drive, etc)"
                  required
                />
              </div>
              <div class="d-flex justify-content-end">
                <button
                  class="btn btn-secondary me-2"
                  type="button"
                  @click="closeBookModal"
                  :disabled="bookFormLoading"
                >
                  Cancel
                </button>
                <button
                  class="btn btn-success"
                  type="submit"
                  :disabled="bookFormLoading"
                >
                  <span v-if="bookFormLoading" class="spinner-border spinner-border-sm"></span>
                  <span v-else>{{ modalMode === 'edit' ? 'Update' : 'Add' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Management -->
    <div v-else-if="activeSection === 'users'">
      <h3 class="mb-4">All Users</h3>
      <div v-if="users.length === 0" class="alert alert-info">No users found.</div>
      <div class="table-responsive" v-else>
        <table class="table table-bordered table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.firstName }} {{ user.lastName }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>{{ user.phoneNumber || 'N/A' }}</td>
              <td>{{ user.age || 'N/A' }}</td>
              <td>
                <button class="btn btn-info btn-sm" @click="selectUser(user)">
                  View Details
                </button>
                <button
                  class="btn btn-danger btn-sm ms-1"
                  @click="askDeleteUser(user)"
                  :disabled="deletingUserId === user.id"
                >
                  <span
                    v-if="deletingUserId === user.id"
                    class="spinner-border spinner-border-sm"
                  ></span>
                  <span v-else>Delete</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- User Details Modal -->
      <div v-if="selectedUser" class="modal-backdrop-custom" @click.self="selectedUser = null">
        <div class="modal-custom" style="width: 70%; max-width: 800px;">
          <div class="modal-header">
            <h5 class="modal-title">User Details: {{ selectedUser.firstname }} {{ selectedUser.lastname }}</h5>
            <button type="button" class="btn-close" @click="selectedUser = null"></button>
          </div>
          <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
            <div class="row">
              <div class="col-md-6">
                <h6>Personal Information</h6>
                <p><strong>Email:</strong> {{ selectedUser.email }}</p>
                <p><strong>Phone:</strong> {{ selectedUser.phoneNumber || 'N/A' }}</p>
                <p><strong>Age:</strong> {{ selectedUser.age || 'N/A' }}</p>
                <p><strong>Role:</strong> {{ selectedUser.role }}</p>
              </div>
              <div class="col-md-6">
                <h6>Activity Summary</h6>
                <p><strong>Books Borrowed:</strong> {{ selectedUser.borrowedBooks?.length || 0 }}</p>
                <p><strong>Books Bought:</strong> {{ selectedUser.broughtBooks?.length || 0 }}</p>
                <p><strong>Appointments:</strong> {{ selectedUser.appointments?.length || 0 }}</p>
                <p><strong>Comments:</strong> {{ selectedUser.comments?.length || 0 }}</p>
              </div>
            </div>
            
            <h6 class="mt-3">Recent Transactions</h6>
            <div v-if="selectedUser.transactionHistory?.length">
              <ul class="list-group">
                <li v-for="tx in selectedUser.transactionHistory.slice(0, 5)" :key="tx.id" class="list-group-item">
                  <strong>{{ tx.title || 'Book Transaction' }}</strong> - ₦{{ tx.amount }} 
                  <span class="badge bg-primary ms-2">{{ tx.type }}</span>
                  <small class="text-muted d-block">{{ formatDate(tx.date) }}</small>
                </li>
              </ul>
            </div>
            <p v-else class="text-muted">No transactions found.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Transactions -->
    <div v-else-if="activeSection === 'transactions'">
      <h3 class="mb-4">All Transactions</h3>
      <input
        v-model="transactionDateFilter"
        type="date"
        class="form-control mb-2"
        style="max-width: 170px"
      />
      <div v-if="filteredTransactions.length === 0" class="alert alert-info">
        No transactions found.
      </div>
      <div class="table-responsive" v-else>
        <table class="table table-bordered table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>Book</th>
              <th>User</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in filteredTransactions" :key="tx.id">
              <td>{{ tx.title || 'Book Transaction' }}</td>
              <td>{{ getUserName(tx.userId) }}</td>
              <td>
                <span class="badge" :class="tx.type === 'buy' ? 'bg-success' : 'bg-info'">
                  {{ tx.type === 'buy' ? 'Purchase' : 'Rental' }}
                </span>
              </td>
              <td>₦{{ tx.amount }}</td>
              <td>{{ formatDate(tx.date) }}</td>
              <td>{{ tx.reference || 'N/A' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="modal-backdrop-custom">
      <div class="modal-custom">
        <div class="modal-header">
          <h5 class="modal-title">Confirm Action</h5>
          <button type="button" class="btn-close" @click="closeConfirmModal"></button>
        </div>
        <div class="modal-body">
          <p>{{ confirmMessage }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeConfirmModal">Cancel</button>
          <button class="btn btn-danger" @click="executeConfirmAction">Yes, Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminManagement',
  props: {
    activeSection: { type: String, required: true },
    books: { type: Array, default: () => [] },
    users: { type: Array, default: () => [] },
    transactions: { type: Array, default: () => [] }
  },
  data() {
    return {
      // Book management
      bookSearch: '',
      bookDateFilter: '',
      showBookModal: false,
      modalMode: 'add',
      bookFormLoading: false,
      deletingBookId: null,
      bookForm: {
        id: '',
        title: '',
        author: '',
        price: '',
        rent: '',
        image: '',
        description: '',
        pdfUrl: '',
        dateAdded: ''
      },
      
      // User management
      selectedUser: null,
      deletingUserId: null,
      
      // Transaction management
      transactionDateFilter: '',
      
      // Confirmation modal
      showConfirmModal: false,
      confirmMessage: '',
      confirmAction: null,
      confirmTargetId: null,
      confirmType: ''
    }
  },
  computed: {
    filteredBooks() {
      let books = [...this.books]
      
      if (this.bookSearch) {
        books = books.filter(b => 
          b.title?.toLowerCase().includes(this.bookSearch.toLowerCase()) ||
          b.author?.toLowerCase().includes(this.bookSearch.toLowerCase())
        )
      }
      
      if (this.bookDateFilter) {
        books = books.filter(b => 
          b.dateAdded && b.dateAdded.startsWith(this.bookDateFilter)
        )
      }
      
      return books.sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0))
    },
    
    filteredTransactions() {
      let txs = [...this.transactions]
      
      if (this.transactionDateFilter) {
        txs = txs.filter(t => 
          t.date && t.date.startsWith(this.transactionDateFilter)
        )
      }
      
      return txs.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    }
  },
  methods: {
    // Book management methods
    openBookModal(mode, book = null) {
      this.modalMode = mode
      if (mode === 'edit' && book) {
        this.bookForm = { ...book }
      } else {
        this.resetBookForm()
      }
      this.showBookModal = true
    },
    
    closeBookModal() {
      this.showBookModal = false
      this.resetBookForm()
      this.bookFormLoading = false
    },
    
    resetBookForm() {
      this.bookForm = {
        id: '',
        title: '',
        author: '',
        price: '',
        rent: '',
        image: '',
        description: '',
        pdfUrl: '',
        dateAdded: ''
      }
    },
    
    handleImageUpload(e) {
      const file = e.target.files[0]
      if (!file) return
      
      if (!file.type.startsWith('image/')) {
        this.showToast('Only image files are allowed.', true)
        return
      }
      
      const reader = new FileReader()
      reader.onload = (evt) => {
        this.bookForm.image = evt.target.result
        this.showToast('Image uploaded successfully!')
      }
      reader.onerror = () => {
        this.showToast('Failed to read image file.', true)
      }
      reader.readAsDataURL(file)
    },
    
    async addOrUpdateBook() {
      this.bookFormLoading = true
      try {
        this.bookForm.price = Number(this.bookForm.price) || 0
        this.bookForm.rent = Number(this.bookForm.rent) || 0
        this.bookForm.dateAdded = new Date().toISOString().slice(0, 10)
        
        if (this.modalMode === 'edit' && this.bookForm.id) {
          this.$emit('update-book', this.bookForm)
          this.showToast('Book updated successfully!')
        } else {
          this.$emit('add-book', this.bookForm)
          this.showToast('Book added successfully!')
        }
        
        this.closeBookModal()
      } catch (e) {
        this.showToast('Failed to save book!', true)
      } finally {
        this.bookFormLoading = false
      }
    },
    
    editBook(book) {
      this.openBookModal('edit', book)
    },
    
    askDeleteBook(bookId) {
      this.confirmType = 'book'
      this.confirmTargetId = bookId
      this.confirmMessage = 'Are you sure you want to delete this book?'
      this.showConfirmModal = true
    },
    
    // User management methods
    selectUser(user) {
      this.selectedUser = { ...user }
    },
    
    askDeleteUser(user) {
      this.confirmType = 'user'
      this.confirmTargetId = user.id
      this.confirmMessage = `Are you sure you want to delete user ${user.firstname} ${user.lastname}?`
      this.showConfirmModal = true
    },
    
    // Confirmation modal methods
    closeConfirmModal() {
      this.showConfirmModal = false
      this.confirmAction = null
      this.confirmTargetId = null
      this.confirmType = ''
    },
    
    executeConfirmAction() {
      if (this.confirmType === 'book') {
        this.$emit('delete-book', this.confirmTargetId)
      } else if (this.confirmType === 'user') {
        this.$emit('delete-user', this.confirmTargetId)
      }
      this.closeConfirmModal()
    },
    
    // Utility methods
    getUserName(userId) {
      const user = this.users.find(u => u.id === userId)
      return user ? `${user.firstname || ''} ${user.lastname || ''}`.trim() : `User ${userId}`
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    showToast(message, error = false) {
      const toast = document.createElement('div')
      toast.textContent = message
      toast.style.position = 'fixed'
      toast.style.top = '20px'
      toast.style.right = '30px'
      toast.style.background = error ? '#dc3545' : '#28a745'
      toast.style.color = '#fff'
      toast.style.padding = '12px 24px'
      toast.style.borderRadius = '6px'
      toast.style.zIndex = 9999
      toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'
      document.body.appendChild(toast)
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast)
        }
      }, 3000)
    }
  }
}
</script>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-custom {
  background: #fff;
  border-radius: 8px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 1rem;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-close {
  border: none;
  background: none;
  font-size: 1.5rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  .modal-custom {
    width: 95%;
    max-height: 85vh;
  }
  
  .table-responsive {
    font-size: 0.9rem;
  }
}
</style>
