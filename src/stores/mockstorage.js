import axios from 'axios';

const API_URL = 'https://683efaf01cd60dca33ddd10d.mockapi.io/users';
const LOCAL_KEY = 'users_data';

export default {
  // Fetch all users, with localStorage fallback if API fails or times out after 5s
  async fetchUsers() {
    try {
      // Try to fetch from API, but timeout after 5 seconds
      const response = await Promise.race([
        axios.get(API_URL),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
      ]);
      // If successful, save to localStorage for offline use
      localStorage.setItem(LOCAL_KEY, JSON.stringify(response.data));
      return response.data;
    } catch (err) {
      // If API fails or times out, try to get from localStorage
      const local = localStorage.getItem(LOCAL_KEY);
      if (local) {
        return JSON.parse(local);
      }
      // If nothing in localStorage, return empty array
      return [];
    }
  },

  // Fetch a single user by ID, with localStorage fallback
  async fetchUser(id) {
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
    // Update localStorage with new user
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

 async saveBroughtBooks(books) {
    // send books to your API endpoint or mock endpoint

    const response = await axios.post(API_URL, userData);
// coming back ere fo rclarity
  },
  async saveBorrowedBooks(books) {
    // send books to your API endpoint or mock endpoint
  },
  async saveTransactionHistory(transactions) {
    // send transactions to your API endpoint or mock endpoint
  }


};