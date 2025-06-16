import axios from 'axios'

const API_URL = 'http://localhost:3000/books'
const LOCAL_KEY = 'books_data'

const booksstore = {
  // Fetch all books from the bookstore API, fallback to localStorage if needed
  async fetchAllBooks() {
    try {
      const response = await Promise.race([
        axios.get(API_URL),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000)),
      ])
      if (Array.isArray(response.data) && response.data.length === 0) {
        return []
      }
      return response.data
    } catch (err) {
      return []
    }
  },

  // Fetch a single book by ID
  async fetchBook(id) {
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

  // Add a new book to the bookstore API
  async addBook(book) {
    const response = await axios.post(API_URL, book)
    return response.data
  },

  // Update a book in the bookstore API
  async updateBook(id, book) {
    const response = await axios.put(`${API_URL}/${id}`, book)
    return response.data
  },

  // Delete a book from the bookstore API
  async deleteBook(id) {
    const response = await axios.delete(`${API_URL}/${id}`)
    return response.data
  },
}

export default booksstore
