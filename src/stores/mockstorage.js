import axios from 'axios';

const API_URL = 'https://683efaf01cd60dca33ddd10d.mockapi.io/users';
const LOCAL_KEY = 'users_data';

export default {
  // Fetch all users (admin only)
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
      if (local) return JSON.parse(local);
      return [];
    }
  },

  // Fetch a single user by ID
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

  // Create a new user
  async createUser(userData) {
    const response = await axios.post(API_URL, userData);
    let users = [];
    try { users = await this.fetchUsers(); } catch {}
    users.push(response.data);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(users));
    return response.data;
  },

  // Update a user
  async updateUser(id, userData) {
    const response = await axios.put(`${API_URL}/${id}`, userData);
    let users = [];
    try { users = await this.fetchUsers(); } catch {}
    users = users.map(u => (u.id == id ? response.data : u));
    localStorage.setItem(LOCAL_KEY, JSON.stringify(users));
    return response.data;
  },

  // Delete a user
  async deleteUser(id) {
    const response = await axios.delete(`${API_URL}/${id}`);
    let users = [];
    try { users = await this.fetchUsers(); } catch {}
    users = users.filter(u => u.id != id);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(users));
    return response.data;
  },

  // Save brought books for a user
  async saveBroughtBooks(userId, books) {
    if (!userId || !Array.isArray(books)) return;
    for (const book of books) {
      const userData = { ...book, userId, type: 'broughtBook' };
      await axios.post(API_URL, userData);
    }
    let local = JSON.parse(localStorage.getItem(getUserKey('broughtBooks', userId)) || '[]');
    local = local.concat(books);
    localStorage.setItem(getUserKey('broughtBooks', userId), JSON.stringify(local));
  },

  // Save borrowed books for a user
  async saveBorrowedBooks(userId, books) {
    if (!userId || !Array.isArray(books)) return;
    for (const book of books) {
      const userData = { ...book, userId, type: 'borrowedBook' };
      await axios.post(API_URL, userData);
    }
    let local = JSON.parse(localStorage.getItem(getUserKey('borrowedBooks', userId)) || '[]');
    local = local.concat(books);
    localStorage.setItem(getUserKey('borrowedBooks', userId), JSON.stringify(local));
  },

  // Save transaction history for a user
  async saveTransactionHistory(userId, transactions) {
    if (!userId || !Array.isArray(transactions)) return;
    for (const tx of transactions) {
      const txData = { ...tx, userId, type: 'transaction' };
      await axios.post(API_URL, txData);
    }
    let local = JSON.parse(localStorage.getItem(getUserKey('transactionHistory', userId)) || '[]');
    local = local.concat(transactions);
    localStorage.setItem(getUserKey('transactionHistory', userId), JSON.stringify(local));
  },

  // Fetch brought books for a user
  async fetchBroughtBooks(userId) {
    if (!userId) return [];
    try {
      const users = await this.fetchUsers();
      return users.filter(u => u.type === 'broughtBook' && u.userId == userId);
    } catch {
      return JSON.parse(localStorage.getItem(getUserKey('broughtBooks', userId)) || '[]');
    }
  },

  // Fetch borrowed books for a user
  async fetchBorrowedBooks(userId) {
    if (!userId) return [];
    try {
      const users = await this.fetchUsers();
      return users.filter(u => u.type === 'borrowedBook' && u.userId == userId);
    } catch {
      return JSON.parse(localStorage.getItem(getUserKey('borrowedBooks', userId)) || '[]');
    }
  },

  // Fetch transaction history for a user
  async fetchTransactionHistory(userId) {
    if (!userId) return [];
    try {
      const users = await this.fetchUsers();
      return users.filter(u => u.type === 'transaction' && u.userId == userId);
    } catch {
      return JSON.parse(localStorage.getItem(getUserKey('transactionHistory', userId)) || '[]');
    }
  },

  // Save a comment to a book (by id, for a user)
  async saveBookComment(bookId, comments) {
    if (!bookId) return;
    const users = await this.fetchUsers();
    const book = users.find(u => u.id == bookId);
    if (book) {
      book.comments = comments;
      await this.updateUser(bookId, book);
    }
  },

  // Return a borrowed book (delete from API and localStorage for user)
  async returnBorrowedBook(bookId, userId) {
    if (!bookId || !userId) return;
    await this.deleteUser(bookId);
    let local = JSON.parse(localStorage.getItem(getUserKey('borrowedBooks', userId)) || '[]');
    local = local.filter(b => b.id != bookId);
    localStorage.setItem(getUserKey('borrowedBooks', userId), JSON.stringify(local));
  },

  // Appointments for a user
  async fetchAppointments(userId) {
    if (!userId) return [];
    try {
      const users = await this.fetchUsers();
      return users.filter(u => u.type === 'appointment' && u.userId == userId);
    } catch {
      return JSON.parse(localStorage.getItem(getUserKey('appointments', userId)) || '[]');
    }
  },
  async saveAppointment(userId, appointment) {
    if (!userId) return;
    const data = { ...appointment, userId, type: 'appointment' };
    await axios.post(API_URL, data);
    let local = JSON.parse(localStorage.getItem(getUserKey('appointments', userId)) || '[]');
    local.push(data);
    localStorage.setItem(getUserKey('appointments', userId), JSON.stringify(local));
  },

  // Save user details
  async saveUser(user) {
    if (!user.id) {
      return await this.createUser(user);
    } else {
      return await this.updateUser(user.id, user);
    }
  },

  // ----------- ADMIN DASHBOARD FETCHERS -----------

  async fetchAllBooks() {
    try {
      const users = await this.fetchUsers();
      return users.filter(u => u.type === 'broughtBook' || u.type === 'borrowedBook');
    } catch {
      // fallback: merge all local user books
      let all = [];
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('broughtBooks_') || key.startsWith('borrowedBooks_')) {
          all = all.concat(JSON.parse(localStorage.getItem(key) || '[]'));
        }
      });
      return all;
    }
  },

  async fetchAllAppointments() {
    try {
      const users = await this.fetchUsers();
      return users.filter(u => u.type === 'appointment');
    } catch {
      let all = [];
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('appointments_')) {
          all = all.concat(JSON.parse(localStorage.getItem(key) || '[]'));
        }
      });
      return all;
    }
  },

  async fetchAllTransactions() {
    try {
      const users = await this.fetchUsers();
      return users.filter(u => u.type === 'transaction');
    } catch {
      let all = [];
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('transactionHistory_')) {
          all = all.concat(JSON.parse(localStorage.getItem(key) || '[]'));
        }
      });
      return all;
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
