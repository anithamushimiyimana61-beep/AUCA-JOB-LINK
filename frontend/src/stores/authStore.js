import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || '');
  const isAuthenticated = computed(() => !!token.value);
  const userRole = computed(() => user.value?.role || localStorage.getItem('role') || null);

  const login = async (email, password) => {
    const res = await axios.post(`${API}/login`, { email, password });
    token.value = res.data.token;
    user.value = { name: res.data.name, email: res.data.email, role: res.data.role };
    localStorage.setItem('token', token.value);
    localStorage.setItem('role', res.data.role);
    return res.data;
  };

  const register = async (name, email, password, role) => {
    const res = await axios.post(`${API}/register`, { name, email, password, role });
    return res.data;
  };

  const logout = () => {
    user.value = null;
    token.value = '';
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  return { user, token, isAuthenticated, userRole, login, register, logout };
});
