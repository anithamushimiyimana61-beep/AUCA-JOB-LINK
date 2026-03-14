<template>
  <div class="login">
    <div class="login-container">
      <div class="login-left">
        <img src="/slide1.png" alt="AUCA Campus" class="background-image" />
        <div class="overlay">
          <h1>Welcome to AUCA JobLink</h1>
          <p>Your gateway to career opportunities</p>
        </div>
      </div>
      <div class="login-right">
        <div class="login-card">
          <div class="logo-container">
            <img src="/logo.png" alt="AUCA Logo" class="logo" />
          </div>
          <h2>Student Login</h2>
          <p class="subtitle">Enter your credentials to continue</p>
          <p v-if="error" class="error">{{ error }}</p>
          <input v-model="email" placeholder="Email (e.g., student@auca.ac.rw)" type="email" />
          <input v-model="password" type="password" placeholder="Password" />
          <button @click="login">Login</button>
          <p class="register-link">Don't have an account? <router-link to="/register">Register</router-link></p>
        </div>
      </div>
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
          `${import.meta.env.VITE_API_URL}/api/auth/login`,
          {
            email: this.email,
            password: this.password
          }
        );

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);

        window.location.href = "/dashboard";
      } catch (err) {
        this.error = err.response?.data?.message || "Invalid credentials. Please check your email and password.";
      }
    }
  }
};
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
}

.login-container {
  display: flex;
  width: 100%;
  height: 100vh;
}

.login-left {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(102, 126, 234, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 40px;
}

.overlay h1 {
  font-size: 48px;
  margin-bottom: 20px;
  text-align: center;
}

.overlay p {
  font-size: 24px;
  text-align: center;
}

.login-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
  padding: 40px;
}

.login-card {
  background: white;
  padding: 50px;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}

.logo-container {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

h2 {
  text-align: center;
  color: #333;
  font-size: 28px;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-bottom: 30px;
}

input {
  width: 100%;
  padding: 15px;
  margin-bottom: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  box-sizing: border-box;
  transition: border 0.3s;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

button {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.error {
  color: #e74c3c;
  background: #fadbd8;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 14px;
}

.register-link {
  text-align: center;
  margin-top: 25px;
  color: #666;
  font-size: 14px;
}

.register-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: bold;
}

.register-link a:hover {
  text-decoration: underline;
}

@media (max-width: 968px) {
  .login-container {
    flex-direction: column;
  }

  .login-left {
    min-height: 300px;
  }

  .overlay h1 {
    font-size: 32px;
  }

  .overlay p {
    font-size: 18px;
  }
}
</style>
