<template>
  <div class="register">
    <div class="register-container">
      <div class="register-left">
        <img src="/slide2.png" alt="AUCA Campus" class="background-image" />
        <div class="overlay">
          <h1>Join AUCA JobLink</h1>
          <p>Start your career journey today</p>
        </div>
      </div>
      <div class="register-right">
        <div class="register-card">
          <div class="logo-container">
            <img src="/logo.png" alt="AUCA Logo" class="logo" />
          </div>
          <h2>Student Registration</h2>
          <p class="subtitle">Create your account to get started</p>

          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
          <p v-if="successMessage" class="success">{{ successMessage }}</p>

          <form @submit.prevent="register">
            <input v-model="username" type="text" placeholder="Full Name" required />
            <input v-model="studentId" type="text" placeholder="Student ID" required />
            <input v-model="email" type="email" placeholder="Email (e.g., student@auca.ac.rw)" required />
            <input v-model="password" type="password" placeholder="Password (min 6 characters)" required />

            <button type="submit">Create Account</button>
          </form>

          <p class="login-link">
            Already have an account?
            <router-link to="/login">Login</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      studentId: "",
      email: "",
      password: "",
      errorMessage: "",
      successMessage: ""
    };
  },
  methods: {
    async register() {
      this.errorMessage = "";
      this.successMessage = "";

      if (!this.email.endsWith("@auca.ac.rw")) {
        this.errorMessage = "Email must end with @auca.ac.rw";
        return;
      }

      if (this.password.length < 6) {
        this.errorMessage = "Password must be at least 6 characters";
        return;
      }

      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
          name: this.username,
          email: this.email,
          password: this.password,
          role: "student"
        });

        this.successMessage = "Registration successful! Redirecting to login...";

        setTimeout(() => {
          this.$router.push("/login");
        }, 2000);

      } catch (error) {
        this.errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      }
    }
  }
};
</script>

<style scoped>
.register {
  min-height: 100vh;
  display: flex;
}

.register-container {
  display: flex;
  width: 100%;
  height: 100vh;
}

.register-left {
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
  background: rgba(118, 75, 162, 0.8);
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

.register-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
  padding: 40px;
  overflow-y: auto;
}

.register-card {
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
  border-color: #764ba2;
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
  box-shadow: 0 5px 15px rgba(118, 75, 162, 0.4);
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

.success {
  color: #27ae60;
  background: #d5f4e6;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 14px;
}

.login-link {
  text-align: center;
  margin-top: 25px;
  color: #666;
  font-size: 14px;
}

.login-link a {
  color: #764ba2;
  text-decoration: none;
  font-weight: bold;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 968px) {
  .register-container {
    flex-direction: column;
  }

  .register-left {
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
