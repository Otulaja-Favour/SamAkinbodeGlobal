import axios from 'axios';

const API_URL = 'https://683efaf01cd60dca33ddd10d.mockapi.io/users';

export default {
  // Fetch all users
  async fetchUsers() {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Fetch a single user by ID
  async fetchUser(id) {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Create a new user
  async createUser(userData) {
    const response = await axios.post(API_URL, userData);
    return response.data;
  },

  // Update a user by ID
  async updateUser(id, userData) {
    const response = await axios.put(`${API_URL}/${id}`, userData);
    return response.data;
  },

  // Delete a user by ID
  async deleteUser(id) {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  }
};