<template>
  <div class="admin-login">
    <div class="login-card">
      <div class="logo-container">
        <img src="/logo.png" alt="AUCA Logo" class="logo" />
      </div>
      <h2>Admin Login</h2>
      <p class="subtitle">AUCA JobLink Administration</p>
      <p v-if="error" class="error">{{ error }}</p>
      <input v-model="email" placeholder="Admin Email" type="email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button @click="login">Login</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return { email: "", password: "", error: "" };
  },
  methods: {
    async login() {
      try {
        this.error = "";
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/login`,
          {
            email: this.email,
            password: this.password
          }
        );

        if (res.data.role !== "admin") {
          this.error = "Access denied. Admin only.";
          return;
        }

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);

        window.location.href = "/admin-dashboard";
      } catch (err) {
        this.error = err.response?.data?.message || "Login failed.";
      }
    }
  }
};
</script>

<style scoped>
.admin-login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
}

.logo-container {
  text-align: center;
  margin-bottom: 20px;
}

.logo {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 5px;
}

.subtitle {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-bottom: 25px;
}

input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #2c3e50;
}

button {
  width: 100%;
  padding: 12px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background: #1a252f;
}

.error {
  color: #e74c3c;
  background: #fadbd8;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  text-align: center;
}
</style>
