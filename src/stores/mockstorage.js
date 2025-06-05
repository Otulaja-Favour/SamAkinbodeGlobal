import axios from 'axios';

const API_URL = 'https://683efaf01cd60dca33ddd10d.mockapi.io/users';
const LOCAL_KEY = 'users_data';

export default {
  // Fetch all users, with localStorage fallback if API fails or times out after 5s
  async fetchUsers() {
    try {
      const response = await Promise.race([
        axios.get(API_URL),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
      ]);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(response.data));
      return response.data;
    } catch (err) {
      const local = localStorage.getItem(LOCAL_KEY);
      if (local) {
        return JSON.parse(local);
      }
      return [];
    }
  },

  // Fetch a single user by ID, with localStorage fallback
  async fetchUser(id) {
    if (!id) return null;
    try {
      const response = await Promise.race([
        axios.get(`${API_URL}/${id}`),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
      ]);
      return response.data;
    } catch (err) {
      const local = localStorage.getItem(LOCAL_KEY);
      if (local) {
        const users = JSON.parse(local);
        return users.find(u => u.id == id) || null;
      }
      return null;
    }
  },

  // Create a new user and update localStorage
  async createUser(userData) {
    const response = await axios.post(API_URL, userData);
    let users = [];
    try {
      users = await this.fetchUsers();
    } catch {}
    users.push(response.data);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(users));
    return response.data;
  },

  // Update a user by ID and update localStorage
  async updateUser(id, userData) {
    const response = await axios.put(`${API_URL}/${id}`, userData);
    let users = [];
    try {
      users = await this.fetchUsers();
    } catch {}
    users = users.map(u => (u.id == id ? response.data : u));
    localStorage.setItem(LOCAL_KEY, JSON.stringify(users));
    return response.data;
  },

  // Delete a user by ID and update localStorage
  async deleteUser(id) {
    const response = await axios.delete(`${API_URL}/${id}`);
    let users = [];
    try {
      users = await this.fetchUsers();
    } catch {}
    users = users.filter(u => u.id != id);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(users));
    return response.data;
  },

  // Save brought books (buy)
  async saveBroughtBooks(books) {
    if (!Array.isArray(books) || books.length === 0) return;
    for (const book of books) {
      const userData = { ...book, type: 'broughtBook' };
      await axios.post(API_URL, userData);
    }
    let local = JSON.parse(localStorage.getItem('broughtBooks') || '[]');
    local = local.concat(books);
    localStorage.setItem('broughtBooks', JSON.stringify(local));
  },

  // Save borrowed books (rent)
  async saveBorrowedBooks(books) {
    if (!Array.isArray(books) || books.length === 0) return;
    for (const book of books) {
      const userData = { ...book, type: 'borrowedBook' };
      await axios.post(API_URL, userData);
    }
    let local = JSON.parse(localStorage.getItem('borrowedBooks') || '[]');
    local = local.concat(books);
    localStorage.setItem('borrowedBooks', JSON.stringify(local));
  },

  // Save transaction history
  async saveTransactionHistory(transactions) {
    if (!Array.isArray(transactions) || transactions.length === 0) return;
    for (const tx of transactions) {
      const txData = { ...tx, type: 'transaction' };
      await axios.post(API_URL, txData);
    }
    let local = JSON.parse(localStorage.getItem('transactionHistory') || '[]');
    local = local.concat(transactions);
    localStorage.setItem('transactionHistory', JSON.stringify(local));
  },

  // Fetch brought books (buy)
  async fetchBroughtBooks() {
    try {
      const users = await this.fetchUsers();
      return users.filter(u => u.type === 'broughtBook');
    } catch {
      return JSON.parse(localStorage.getItem('broughtBooks') || '[]');
    }
  },

  // Fetch borrowed books (rent)
  async fetchBorrowedBooks() {
    try {
      const users = await this.fetchUsers();
      return users.filter(u => u.type === 'borrowedBook');
    } catch {
      return JSON.parse(localStorage.getItem('borrowedBooks') || '[]');
    }
  },

  // Fetch transaction history
  async fetchTransactionHistory() {
    try {
      const users = await this.fetchUsers();
      return users.filter(u => u.type === 'transaction');
    } catch {
      return JSON.parse(localStorage.getItem('transactionHistory') || '[]');
    }
  },

  // Save a comment to a book (by id)
  async saveBookComment(bookId, comments) {
    if (!bookId) return;
    const users = await this.fetchUsers();
    const book = users.find(u => u.id == bookId);
    if (book) {
      book.comments = comments;
      await this.updateUser(bookId, book);
    }
  },

  // Return a borrowed book (delete from API)
  async returnBorrowedBook(bookId) {
    if (!bookId) return;
    await this.deleteUser(bookId);
    // Optionally update localStorage
    let local = JSON.parse(localStorage.getItem('borrowedBooks') || '[]');
    local = local.filter(b => b.id != bookId);
    localStorage.setItem('borrowedBooks', JSON.stringify(local));
  },

  // Appointments
  async fetchAppointments() {
    try {
      const users = await this.fetchUsers();
      return users.filter(u => u.type === 'appointment');
    } catch {
      return JSON.parse(localStorage.getItem('appointments') || '[]');
    }
  },
  async saveAppointment(appointment) {
    const data = { ...appointment, type: 'appointment' };
    await axios.post(API_URL, data);
    let local = JSON.parse(localStorage.getItem('appointments') || '[]');
    local.push(data);
    localStorage.setItem('appointments', JSON.stringify(local));
  },

  // Save user details
  async saveUser(user) {
    if (!user.id) {
      // If no id, create new
      return await this.createUser(user);
    } else {
      return await this.updateUser(user.id, user);
    }
  },

  // ----------- ADMIN DASHBOARD FETCHERS -----------

  // Fetch all books (for admin)
  async fetchAllBooks() {
    try {
      const users = await this.fetchUsers();
      // Books are those with type 'broughtBook' or 'borrowedBook'
      return users.filter(u => u.type === 'broughtBook' || u.type === 'borrowedBook');
    } catch {
      const localBrought = JSON.parse(localStorage.getItem('broughtBooks') || '[]');
      const localBorrowed = JSON.parse(localStorage.getItem('borrowedBooks') || '[]');
      return [...localBrought, ...localBorrowed];
    }
  },

  // Fetch all appointments (for admin)
  async fetchAllAppointments() {
    try {
      const users = await this.fetchUsers();
      return users.filter(u => u.type === 'appointment');
    } catch {
      return JSON.parse(localStorage.getItem('appointments') || '[]');
    }
  },

  // Fetch all transactions (for admin)
  async fetchAllTransactions() {
    try {
      const users = await this.fetchUsers();
      return users.filter(u => u.type === 'transaction');
    } catch {
      return JSON.parse(localStorage.getItem('transactionHistory') || '[]');
    }
  },

  // Add these methods to your export default object

async addBook(book) {
  // book.type should be 'broughtBook' or 'borrowedBook'
  const response = await axios.post('https://683efaf01cd60dca33ddd10d.mockapi.io/users', book);
  return response.data;
},

async updateBook(id, book) {
  const response = await axios.put(`https://683efaf01cd60dca33ddd10d.mockapi.io/users/${id}`, book);
  return response.data;
},

async deleteBook(id) {
  const response = await axios.delete(`https://683efaf01cd60dca33ddd10d.mockapi.io/users/${id}`);
  return response.data;
},
  
};
