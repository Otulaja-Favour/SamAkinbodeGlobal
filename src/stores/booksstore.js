import axios from 'axios';

const API_URL = 'https://683efaf01cd60dca33ddd10d.mockapi.io/books';
const LOCAL_KEY = 'books_data';

export default {
  // Fetch all books, with localStorage fallback if API fails or times out after 5s
  async fetchBooks() {
    try {
      const response = await Promise.race([
        axios.get(API_URL),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
      ]);
      // Save to localStorage for offline use
      localStorage.setItem(LOCAL_KEY, JSON.stringify(response.data));
      // If API returns empty array, try to use localStorage data
      if (Array.isArray(response.data) && response.data.length === 0) {
        const local = localStorage.getItem(LOCAL_KEY);
        if (local) return JSON.parse(local);
      }
      return response.data;
    } catch (err) {
      // On error, try to get from localStorage
      const local = localStorage.getItem(LOCAL_KEY);
      if (local) return JSON.parse(local);
      return [];
    }
  },

  // Fetch a single book by ID, with localStorage fallback
  async fetchBook(id) {
    try {
      const response = await Promise.race([
        axios.get(`${API_URL}/${id}`),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
      ]);
      return response.data;
    } catch (err) {
      const local = localStorage.getItem(LOCAL_KEY);
      if (local) {
        const books = JSON.parse(local);
        return books.find(b => b.id == id) || null;
      }
      return null;
    }
  },

  // Create a new book and update localStorage
  async createBook(book) {
    const response = await axios.post(API_URL, book);
    let books = [];
    try {
      books = await this.fetchBooks();
    } catch {}
    books.push(response.data);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(books));
    return response.data;
  },

  // Update a book by ID and update localStorage
  async updateBook(id, book) {
    const response = await axios.put(`${API_URL}/${id}`, book);
    let books = [];
    try {
      books = await this.fetchBooks();
    } catch {}
    books = books.map(b => (b.id == id ? response.data : b));
    localStorage.setItem(LOCAL_KEY, JSON.stringify(books));
    return response.data;
  },

  // Delete a book by ID and update localStorage
  async deleteBook(id) {
    const response = await axios.delete(`${API_URL}/${id}`);
    let books = [];
    try {
      books = await this.fetchBooks();
    } catch {}
    books = books.filter(b => b.id != id);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(books));
    return response.data;
  }
};