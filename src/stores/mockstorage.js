import axios from "axios"

// Configuration
const CONFIG = {
  BASE_URL: "https://samapi-juio.onrender.com",
  TIMEOUT: 10000,
}

const ENDPOINTS = {
  USERS: `${CONFIG.BASE_URL}/users`,
  BOOKS: `${CONFIG.BASE_URL}/books`,
  TRANSACTIONS: `${CONFIG.BASE_URL}/transactions`,
  APPOINTMENTS: `${CONFIG.BASE_URL}/appointments`,
  COMMENTS: `${CONFIG.BASE_URL}/comments`,
}

// Configure axios defaults
axios.defaults.timeout = CONFIG.TIMEOUT

export default {
  // Initialize database
  async initDb() {
    try {
      // Check if server is running
      const response = await axios.get(`${CONFIG.BASE_URL}/users`)
      // console.log("Database connection successful")
      return true
    } catch (error) {
      // console.error("Failed to connect to database:", error.message)
      return false
    }
  },

  // User management
  async fetchUsers() {
    try {
      const res = await axios.get(ENDPOINTS.USERS)
      return Array.isArray(res.data) ? res.data : []
    } catch (err) {
      // console.error("Fetch users failed:", err.message)
      return []
    }
  },

  async fetchUser(id) {
    if (!id) {
      // console.error("Fetch user failed: User ID is required")
      return null
    }
    try {
      const res = await axios.get(`${ENDPOINTS.USERS}/${id}`)
      return res.data || null
    } catch (err) {
      // console.error(`Fetch user failed for ID ${id}:`, err.message)
      return null
    }
  },

  async createUser(user) {
    try {
      const userData = {
        ...user,
        id: user.id || `user_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: user.role || "user",
        broughtBooks: [],
        borrowedBooks: [],
        transactionHistory: [],
        appointments: [],
        comments: [],
        cart: [],
      }
      const res = await axios.post(ENDPOINTS.USERS, userData)
      // console.log(`User created successfully: ${userData.id}`)
      return res.data || userData
    } catch (err) {
      // console.error("Create user failed:", err.message)
      throw new Error("Failed to create user")
    }
  },

  async updateUser(id, updates) {
    try {
      const currentUser = await this.fetchUser(id)
      if (!currentUser) {
        throw new Error(`User not found: ${id}`)
      }
      const updatedUser = {
        ...currentUser,
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      const res = await axios.put(`${ENDPOINTS.USERS}/${id}`, updatedUser)
      // console.log(`User updated successfully: ${id}`)
      return res.data || updatedUser
    } catch (err) {
      // console.error(`Update user failed for ID ${id}:`, err.message)
      throw new Error("Failed to update user")
    }
  },

  async deleteUser(id) {
    try {
      await axios.delete(`${ENDPOINTS.USERS}/${id}`)
      // console.log(`User deleted successfully: ${id}`)
      return { success: true }
    } catch (err) {
      // console.error(`Delete user failed for ID ${id}:`, err.message)
      throw new Error("Failed to delete user")
    }
  },

  // Book management
  async fetchAllBooks() {
    try {
      const res = await axios.get(ENDPOINTS.BOOKS)
      return Array.isArray(res.data) ? res.data : []
    } catch (err) {
      // console.error("Fetch all books failed:", err.message)
      return []
    }
  },

  async addBook(bookData) {
    try {
      const newBook = {
        ...bookData,
        id: bookData.id || `book_${Date.now()}`,
        dateAdded: new Date().toISOString(),
      }
      const res = await axios.post(ENDPOINTS.BOOKS, newBook)
      // console.log(`Book added successfully: ${newBook.id}`)
      return res.data || newBook
    } catch (err) {
      // console.error("Add book failed:", err.message)
      throw new Error("Failed to add book")
    }
  },

  async updateBook(id, bookData) {
    try {
      const res = await axios.put(`${ENDPOINTS.BOOKS}/${id}`, bookData)
      // console.log(`Book updated successfully: ${id}`)
      return res.data || bookData
    } catch (err) {
      // console.error(`Update book failed for ID ${id}:`, err.message)
      throw new Error("Failed to update book")
    }
  },

  async deleteBook(id) {
    try {
      await axios.delete(`${ENDPOINTS.BOOKS}/${id}`)
      // console.log(`Book deleted successfully: ${id}`)
      return { success: true }
    } catch (err) {
      // console.error(`Delete book failed for ID ${id}:`, err.message)
      throw new Error("Failed to delete book")
    }
  },

  // Transaction management
  async saveTransaction(userId, transaction) {
    if (!userId || !transaction) {
      throw new Error("Invalid transaction data")
    }
    try {
      const formattedTransaction = {
        id: transaction.id || `tx_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        userId,
        totalAmount: transaction.totalAmount,
        items: transaction.items || [],
        date: transaction.date || new Date().toISOString(),
        reference: transaction.reference,
        status: "completed",
        metadata: transaction.metadata || {},
      }

      // Save transaction to transactions endpoint
      const response = await axios.post(ENDPOINTS.TRANSACTIONS, formattedTransaction)

      // Update user's transaction history
      const currentUser = await this.fetchUser(userId)
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          transactionHistory: [...(currentUser.transactionHistory || []), formattedTransaction],
        }
        await this.updateUser(userId, updatedUser)
      }

      // console.log(`Transaction saved successfully: ${formattedTransaction.id}`)
      return response.data
    } catch (error) {
      // console.error(`Failed to save transaction for user ${userId}:`, error.message)
      throw new Error(`Failed to save transaction: ${error.message}`)
    }
  },

  async fetchAllTransactions() {
    try {
      const res = await axios.get(ENDPOINTS.TRANSACTIONS)
      return Array.isArray(res.data) ? res.data : []
    } catch (err) {
      // console.error("Fetch all transactions failed:", err.message)
      return []
    }
  },

  // Purchase/Rental management
  async processPurchase(userId, cartItems, paymentReference) {
    try {
      if (!userId || !cartItems || !cartItems.length) {
        throw new Error("Invalid purchase data")
      }

      const timestamp = Date.now()
      const orderDate = new Date(timestamp).toISOString()

      // Calculate total amount
      const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.price), 0)

      // Create transaction record
      const transaction = {
        id: `tx_${timestamp}`,
        userId,
        totalAmount,
        date: orderDate,
        reference: paymentReference,
        status: "completed",
        items: cartItems.map((item) => ({
          bookId: item.id,
          title: item.title,
          author: item.author || "Unknown",
          type: item.action,
          price: Number(item.price),
          image: item.image,
        })),
      }

      // Save transaction
      await this.saveTransaction(userId, transaction)

      // Update user's books
      const currentUser = await this.fetchUser(userId)
      if (!currentUser) {
        throw new Error("User not found")
      }

      const updatedUser = {
        ...currentUser,
        broughtBooks: [
          ...(currentUser.broughtBooks || []),
          ...cartItems
            .filter((item) => item.action === "buy")
            .map((item) => ({
              id: item.id,
              title: item.title,
              author: item.author || "Unknown",
              image: item.image || "/placeholder-book.jpg",
              price: Number(item.price),
              purchaseDate: orderDate,
              transactionRef: paymentReference,
              type: "bought",
              status: "purchased",
            })),
        ],
        borrowedBooks: [
          ...(currentUser.borrowedBooks || []),
          ...cartItems
            .filter((item) => item.action === "borrow")
            .map((item) => ({
              id: item.id,
              title: item.title,
              author: item.author || "Unknown",
              image: item.image || "/placeholder-book.jpg",
              price: Number(item.price),
              borrowDate: orderDate,
              dueDate: new Date(timestamp + 14 * 24 * 60 * 60 * 1000).toISOString(),
              transactionRef: paymentReference,
              type: "borrowed",
              status: "active",
            })),
        ],
        cart: [], // Clear cart after purchase
      }

      // Update user
      const savedUser = await this.updateUser(userId, updatedUser)

      // console.log(`Purchase processed successfully for user ${userId}`)
      return {
        success: true,
        transaction,
        user: savedUser,
      }
    } catch (error) {
      // console.error(`Failed to process purchase for user ${userId}:`, error.message)
      throw new Error(`Failed to process purchase: ${error.message}`)
    }
  },

  // Cart management
  async getUserCart(userId) {
    try {
      const user = await this.fetchUser(userId)
      return Array.isArray(user?.cart) ? user.cart : []
    } catch (error) {
      // console.error(`Failed to get user cart for user ${userId}:`, error.message)
      return []
    }
  },

  async saveUserCart(userId, cart) {
    try {
      const currentUser = await this.fetchUser(userId)
      if (!currentUser) {
        throw new Error(`User not found: ${userId}`)
      }
      const updatedUser = {
        ...currentUser,
        cart: Array.isArray(cart) ? cart : [],
        updatedAt: new Date().toISOString(),
      }
      await this.updateUser(userId, updatedUser)
      // console.log(`Cart saved successfully for user ${userId}`)
      return true
    } catch (error) {
      // console.error(`Failed to save user cart for user ${userId}:`, error.message)
      throw new Error(`Failed to save user cart: ${error.message}`)
    }
  },

  // Appointment management
  async saveAppointment(userId, appointment) {
    if (!userId || !appointment) {
      throw new Error("Missing appointment data")
    }
    try {
      const appointmentData = {
        ...appointment,
        userId,
        id: appointment.id || `apt_${userId}_${Date.now()}`,
        date: appointment.date || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        status: appointment.status || "pending",
      }

      // Save to appointments endpoint
      const res = await axios.post(ENDPOINTS.APPOINTMENTS, appointmentData)

      // Update user's appointments
      const currentUser = await this.fetchUser(userId)
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          appointments: [...(currentUser.appointments || []), appointmentData],
        }
        await this.updateUser(userId, updatedUser)
      }

      // console.log(`Appointment saved successfully: ${appointmentData.id}`)
      return res.data || appointmentData
    } catch (err) {
      // console.error(`Save appointment failed for user ${userId}:`, err.message)
      throw new Error("Failed to save appointment")
    }
  },

  async fetchAllAppointments() {
    try {
      const res = await axios.get(ENDPOINTS.APPOINTMENTS)
      return Array.isArray(res.data) ? res.data : []
    } catch (err) {
      // console.error("Fetch all appointments failed:", err.message)
      return []
    }
  },

  // Comment management
  async saveComment(userId, bookId, commentText) {
    if (!userId || !bookId || !commentText) {
      throw new Error("Missing comment data")
    }
    try {
      const commentData = {
        id: `comment_${userId}_${Date.now()}`,
        userId,
        bookId,
        text: commentText,
        createdAt: new Date().toISOString(),
      }

      // Save to comments endpoint
      const res = await axios.post(ENDPOINTS.COMMENTS, commentData)

      // Update user's comments
      const currentUser = await this.fetchUser(userId)
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          comments: [...(currentUser.comments || []), commentData],
        }
        await this.updateUser(userId, updatedUser)
      }

      // console.log(`Comment saved successfully: ${commentData.id}`)
      return res.data || commentData
    } catch (err) {
      // console.error(`Save comment failed for user ${userId}:`, err.message)
      throw new Error("Failed to save comment")
    }
  },

  async fetchAllComments() {
    try {
      const res = await axios.get(ENDPOINTS.COMMENTS)
      return Array.isArray(res.data) ? res.data : []
    } catch (err) {
      // console.error("Fetch all comments failed:", err.message)
      return []
    }
  },

  // Utility methods
  async getCurrentUser() {
    try {
      const userData = sessionStorage.getItem("userData")
      if (userData) {
        const user = JSON.parse(userData)
        // Fetch fresh data from server
        return await this.fetchUser(user.id)
      }
      return null
    } catch (err) {
      // console.error("Fetch current user failed:", err.message)
      return null
    }
  },

  logout() {
    sessionStorage.removeItem("userData")
    sessionStorage.removeItem("cart")
    // console.log("User logged out")
    return Promise.resolve(true)
  },

  async healthCheck() {
    try {
      const res = await axios.get(`${CONFIG.BASE_URL}/users`)
      return res.status === 200
    } catch {
      return false
    }
  },
}
