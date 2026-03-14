import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || '');
  const isAuthenticated = computed(() => !!token.value);
  const userRole = computed(() => user.value?.role || localStorage.getItem('role') || null);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        email,
        password
      });
      token.value = res.data.token;
      user.value = res.data.user;
      localStorage.setItem('token', token.value);
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/register`, {
        name,
        email,
        password,
        role
      });
      token.value = res.data.token;
      user.value = res.data.user;
      localStorage.setItem('token', token.value);
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = '';
    localStorage.removeItem('token');
  };

  return {
    user,
    token,
    isAuthenticated,
    userRole,
    login,
    register,
    logout
  };
});
