import axios from 'axios'

// Configuration
const CONFIG = {
  BASE_URL: 'http://localhost:3000',
  SESSION_KEY: 'current_user_data',
  TIMEOUT: 5000
}

const ENDPOINTS = {
  USERS: `${CONFIG.BASE_URL}/users`,
  BOOKS: `${CONFIG.BASE_URL}/books`,
  TRANSACTIONS: `${CONFIG.BASE_URL}/transactions`,
  APPOINTMENTS: `${CONFIG.BASE_URL}/appointments`,
  COMMENTS: `${CONFIG.BASE_URL}/comments`
}

const utils = {
  setSessionUser(userData) {
    try {
      const encoded = btoa(JSON.stringify(userData))
      sessionStorage.setItem(CONFIG.SESSION_KEY, encoded)
      return true
    } catch (err) {
      console.error('Session storage error:', err)
      return false
    }
  },

  getSessionUser() {
    try {
      const encoded = sessionStorage.getItem(CONFIG.SESSION_KEY)
      return encoded ? JSON.parse(atob(encoded)) : null
    } catch {
      return null
    }
  }
}

export default {
  async fetchUsers() {
    try {
      const res = await axios.get(ENDPOINTS.USERS)
      return res.data
    } catch (err) {
      console.error('Fetch users failed:', err)
      return []
    }
  },

  async fetchUser(id) {
    if (!id) return null
    const cached = utils.getSessionUser()
    if (cached?.id === id) return cached

    try {
      const res = await axios.get(`${ENDPOINTS.USERS}/${id}`)
      utils.setSessionUser(res.data)
      return res.data
    } catch (err) {
      console.error('Fetch user failed:', err)
      return null
    }
  },

  async createUser(user) {
    const res = await axios.post(ENDPOINTS.USERS, user)
    utils.setSessionUser(res.data)
    return res.data
  },

  async updateUser(id, user) {
    const res = await axios.put(`${ENDPOINTS.USERS}/${id}`, user)
    const current = utils.getSessionUser()
    if (current?.id === id) utils.setSessionUser(res.data)
    return res.data
  },

  async deleteUser(id) {
    await axios.delete(`${ENDPOINTS.USERS}/${id}`)
    const current = utils.getSessionUser()
    if (current?.id === id) sessionStorage.removeItem(CONFIG.SESSION_KEY)
    return { success: true }
  },

  logout() {
    sessionStorage.removeItem(CONFIG.SESSION_KEY)
  },

  async saveBook(type, userId, book) {
    if (!userId || !book || !type) return
    const bookData = { ...book, userId, type }
    const res = await axios.post(ENDPOINTS.BOOKS, bookData)
    return res.data
  },

  async fetchBooks(type, userId) {
    const res = await axios.get(ENDPOINTS.BOOKS)
    return res.data.filter((b) => b.userId === userId && b.type === type)
  },

  async returnBook(bookId) {
    return await axios.delete(`${ENDPOINTS.BOOKS}/${bookId}`)
  },

  async saveTransaction(userId, txs) {
    for (const tx of txs) {
      const data = { ...tx, userId, type: 'transaction' }
      await axios.post(ENDPOINTS.TRANSACTIONS, data)
    }
  },

  async fetchTransactions(userId) {
    const res = await axios.get(ENDPOINTS.TRANSACTIONS)
    return res.data.filter((t) => t.userId === userId)
  },

  async saveAppointment(userId, appointment) {
    const data = { ...appointment, userId, type: 'appointment' }
    const res = await axios.post(ENDPOINTS.APPOINTMENTS, data)
    return res.data
  },

  async fetchAppointments(userId) {
    const res = await axios.get(ENDPOINTS.APPOINTMENTS)
    return res.data.filter((a) => a.userId === userId)
  },

  async saveComment(userId, bookId, commentText) {
    const data = {
      userId,
      bookId,
      text: commentText,
      date: new Date().toISOString(),
      type: 'comment'
    }
    const res = await axios.post(ENDPOINTS.COMMENTS, data)
    return res.data
  },

  async fetchComments(bookId) {
    const res = await axios.get(ENDPOINTS.COMMENTS)
    return res.data.filter((c) => c.bookId === bookId)
  },

  // Admin fetchers
  async fetchAllBooks() {
   try{

     const res = await axios.get(ENDPOINTS.BOOKS)
     return res.data
   }catch(err){
    console.error('Error', err)
  }
  },

  async fetchAllAppointments() {
   try{

     const res = await axios.get(ENDPOINTS.APPOINTMENTS)
     return res.data
   }catch(err){
    console.error('Error', err)
  }
  },

  async fetchAllTransactions() {
   try{

     const res = await axios.get(ENDPOINTS.TRANSACTIONS)
     return res.data
   }catch(err){
    console.error('Error', err)
  }
  },

  async fetchAllComments() {
   try{

     const res = await axios.get(ENDPOINTS.COMMENTS)
     return res.data
   }catch(err){
    console.error('Error', err)
  }

  },
}
