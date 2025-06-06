import axios from 'axios';

const API_URL = 'https://683efaf01cd60dca33ddd10d.mockapi.io/books';
const LOCAL_KEY = 'books_data';

const booksstore = {
  // Fetch all books from the bookstore API, fallback to localStorage if needed
  async fetchAllBooks() {
    try {
      const response = await Promise.race([
        axios.get(API_URL),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
      ]);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(response.data));
      if (Array.isArray(response.data) && response.data.length === 0) {
        const local = localStorage.getItem(LOCAL_KEY);
        if (local) return JSON.parse(local);
      }
      return response.data;
    } catch (err) {
      const local = localStorage.getItem(LOCAL_KEY);
      if (local) return JSON.parse(local);
      return [];
    }
  },

  // Fetch a single book by ID
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

  // Add a new book to the bookstore API
  async addBook(book) {
    const response = await axios.post(API_URL, book);
    let books = [];
    try {
      books = await this.fetchAllBooks();
    } catch {}
    books.push(response.data);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(books));
    return response.data;
  },

  // Update a book in the bookstore API
  async updateBook(id, book) {
    const response = await axios.put(`${API_URL}/${id}`, book);
    let books = [];
    try {
      books = await this.fetchAllBooks();
    } catch {}
    books = books.map(b => (b.id == id ? response.data : b));
    localStorage.setItem(LOCAL_KEY, JSON.stringify(books));
    return response.data;
  },

  // Delete a book from the bookstore API
  async deleteBook(id) {
    const response = await axios.delete(`${API_URL}/${id}`);
    let books = [];
    try {
      books = await this.fetchAllBooks();
    } catch {}
    books = books.filter(b => b.id != id);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(books));
    return response.data;
  }
};

export default booksstore;