dir /s /b package.jsondir /s /b package.jsondir /s /b package.json
<template>
  <div class="home">
    <nav class="navbar">
      <div class="nav-content">
        <div class="nav-left">
          <img src="/logo.png" alt="AUCA Logo" class="nav-logo" />
          <h1>AUCA JobLink</h1>
        </div>
        <div class="nav-links">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/dashboard" class="nav-link">Jobs</router-link>
          <router-link to="/login" class="nav-btn">Student Login</router-link>
          <router-link to="/admin-login" class="nav-btn-admin">Admin Login</router-link>
        </div>
      </div>
    </nav>

    <section class="hero">
      <div class="slideshow">
        <img :src="slides[currentSlide]" :key="currentSlide" class="slide-image" />
      </div>
      <div class="hero-overlay">
        <h1>Welcome to AUCA JobLink</h1>
        <p>Connecting AUCA Students with Career Opportunities</p>
        <router-link to="/dashboard" class="btn-primary">Explore Jobs</router-link>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      currentSlide: 0,
      slides: ["/slide1.png", "/slide2.png", "/slide3.png"]
    };
  },
  mounted() {
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 3000);
  }
};
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.navbar {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-logo {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.navbar h1 {
  font-size: 24px;
  color: #333;
}

.nav-links {
  display: flex;
  gap: 15px;
  align-items: center;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 500;
}

.nav-link:hover {
  color: #667eea;
}

.nav-btn {
  padding: 8px 20px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 500;
}

.nav-btn:hover {
  background: #5568d3;
}

.nav-btn-admin {
  padding: 8px 20px;
  background: #2c3e50;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 500;
}

.nav-btn-admin:hover {
  background: #1a252f;
}

.hero {
  position: relative;
  height: calc(100vh - 80px);
  overflow: hidden;
}

.slideshow {
  width: 100%;
  height: 100%;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: fadeIn 1s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.hero-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  padding: 60px;
  border-radius: 10px;
}

.hero-overlay h1 {
  font-size: 48px;
  margin-bottom: 20px;
}

.hero-overlay p {
  font-size: 24px;
  margin-bottom: 30px;
}

.btn-primary {
  padding: 15px 40px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 600;
  font-size: 18px;
  display: inline-block;
}

.btn-primary:hover {
  background: #5568d3;
}
</style>
