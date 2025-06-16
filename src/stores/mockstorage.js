import axios from 'axios'

const API_URL = 'http://localhost:3001/users'
const LOCAL_KEY = 'users_data'

export default {
  _fetchFilteredUsers: async function (type, userId = null) {
    try {
      const users = await this.fetchUsers()
      return users.filter((u) => u.type === type && (userId === null || u.userId == userId))
    } catch (error) {
      console.error(`Error fetching filtered users for type ${type}:`, error)
      return []
    }
  },

  // Fetch all users (admin only)
  async fetchUsers() {
    try {
      const response = await Promise.race([
        axios.get(API_URL),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000)),
      ])
      return response.data
    } catch (err) {
      return []
    }
  },

  // Fetch a single user by ID
  async fetchUser(id) {
    if (!id) return null
    try {
      const response = await Promise.race([
        axios.get(`${API_URL}/${id}`),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000)),
      ])
      return response.data
    } catch (err) {
      return null
    }
  },

  // Create a new user
  async createUser(userData) {
    const response = await axios.post(API_URL, userData)
    return response.data
  },

  // Update a user
  async updateUser(id, userData) {
    const response = await axios.put(`${API_URL}/${id}`, userData)
    return response.data
  },

  // Delete a user
  async deleteUser(id) {
    const response = await axios.delete(`${API_URL}/${id}`)
    return response.data
  },

  // Save brought books for a user
  async saveBroughtBooks(userId, books) {
    if (!userId || !Array.isArray(books)) return
    for (const book of books) {
      const userData = { ...book, userId, type: 'broughtBook' }
      await axios.post(API_URL, userData)
    }
  },

  // Save borrowed books for a user
  async saveBorrowedBooks(userId, books) {
    if (!userId || !Array.isArray(books)) return
    for (const book of books) {
      const userData = { ...book, userId, type: 'borrowedBook' }
      await axios.post(API_URL, userData)
    }
  },

  // Save transaction history for a user
  async saveTransactionHistory(userId, transactions) {
    if (!userId || !Array.isArray(transactions)) return
    for (const tx of transactions) {
      const txData = { ...tx, userId, type: 'transaction' }
      await axios.post(API_URL, txData)
    }
  },

  // Fetch brought books for a user
  async fetchBroughtBooks(userId) {
    if (!userId) return []
    return this._fetchFilteredUsers('broughtBook', userId)
  },

  // Fetch borrowed books for a user
  async fetchBorrowedBooks(userId) {
    if (!userId) return []
    return this._fetchFilteredUsers('borrowedBook', userId)
  },

  // Fetch transaction history for a user
  async fetchTransactionHistory(userId) {
    if (!userId) return []
    return this._fetchFilteredUsers('transaction', userId)
  },

  // Save a comment to a book (by id, for a user)
  async saveBookComment(bookId, comments) {
    if (!bookId) return
    const users = await this.fetchUsers()
    const book = users.find((u) => u.id == bookId)
    if (book) {
      book.comments = comments
      await this.updateUser(bookId, book)
    }
  },

  // Return a borrowed book (delete from API and localStorage for user)
  async returnBorrowedBook(bookId, userId) {
    if (!bookId || !userId) return
    await this.deleteUser(bookId)
  },

  // Appointments for a user
  async fetchAppointments(userId) {
    if (!userId) return []
    return this._fetchFilteredUsers('appointment', userId)
  },
  async saveAppointment(userId, appointment) {
    if (!userId) return
    const data = { ...appointment, userId, type: 'appointment' }
    await axios.post(API_URL, data)
  },

  // Save user details
  async saveUser(user) {
    if (!user.id) {
      return await this.createUser(user)
    } else {
      return await this.updateUser(user.id, user)
    }
  },

  // ----------- ADMIN DASHBOARD FETCHERS -----------

  async fetchAllBooks() {
    return this._fetchFilteredUsers('broughtBook', null).then((brought) =>
      this._fetchFilteredUsers('borrowedBook', null).then((borrowed) => [...brought, ...borrowed]),
    )
  },

  async fetchAllAppointments() {
    return this._fetchFilteredUsers('appointment')
  },

  async fetchAllTransactions() {
    return this._fetchFilteredUsers('transaction')
  },
}
