<template>
  <div class="admin-dashboard">
    <nav class="navbar">
      <div class="nav-content">
        <div class="nav-left">
          <img src="/logo.png" alt="AUCA Logo" class="nav-logo" />
          <h1>AUCA JobLink - Admin</h1>
        </div>
        <button @click="logout" class="logout-btn">Logout</button>
      </div>
    </nav>

    <div class="container">
      <div class="content-wrapper">
        <!-- Post Job Form -->
        <div class="post-section">
          <h2>Post New Job</h2>
          <div class="form-card">
            <p v-if="success" class="success">{{ success }}</p>
            <p v-if="error" class="error">{{ error }}</p>
            
            <input v-model="title" placeholder="Job Title" />
            <input v-model="company" placeholder="Company Name" />
            <textarea v-model="description" placeholder="Job Description" rows="6"></textarea>
            <button @click="postJob" class="post-btn">Post Job</button>
          </div>
        </div>

        <!-- Posted Jobs List -->
        <div class="jobs-section">
          <h2>Posted Jobs</h2>
          <div v-if="loading" class="loading">Loading...</div>
          <div v-else-if="jobs.length === 0" class="no-jobs">No jobs posted yet.</div>
          <div v-else class="jobs-list">
            <div v-for="job in jobs" :key="job._id" class="job-item">
              <div class="job-info">
                <h3>{{ job.title }}</h3>
                <p class="company">{{ job.company }}</p>
                <p class="desc">{{ job.description }}</p>
                <span class="date">{{ formatDate(job.createdAt) }}</span>
              </div>
              <button @click="deleteJob(job._id)" class="delete-btn">Delete</button>
            </div>
          </div>
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
      title: "",
      company: "",
      description: "",
      jobs: [],
      loading: true,
      success: "",
      error: ""
    };
  },
  async mounted() {
    await this.fetchJobs();
  },
  methods: {
    async postJob() {
      try {
        this.error = "";
        this.success = "";
        
        await axios.post(
          cd "D:\AUCA JOB-LINK (2) (1)\AUCA JOB-LINK\frontend\auca-job-link-frontend"
          npm install
          npm run dev          `${import.meta.env.VITE_API_URL}/api/jobs`,
          {
            title: this.title,
            company: this.company,
            description: this.description
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        
        this.success = "Job posted successfully!";
        this.title = "";
        this.company = "";
        this.description = "";
        await this.fetchJobs();
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to post job";
      }
    },
    async fetchJobs() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs`);
        this.jobs = res.data;
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        this.loading = false;
      }
    },
    async deleteJob(id) {
      if (confirm("Are you sure you want to delete this job?")) {
        try {
          await axios.delete(`${import.meta.env.VITE_API_URL}/api/jobs/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });
          await this.fetchJobs();
        } catch (err) {
          alert("Failed to delete job");
        }
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: #f5f7fa;
}

.navbar {
  background: #2c3e50;
  padding: 15px 0;
}

.nav-content {
  max-width: 1400px;
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
  color: white;
}

.logout-btn {
  padding: 8px 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.logout-btn:hover {
  background: #c0392b;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.post-section h2,
.jobs-section h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.form-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

input,
textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #2c3e50;
}

.post-btn {
  width: 100%;
  padding: 12px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 600;
}

.post-btn:hover {
  background: #229954;
}

.success {
  color: #27ae60;
  background: #d5f4e6;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  text-align: center;
}

.error {
  color: #e74c3c;
  background: #fadbd8;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  text-align: center;
}

.jobs-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.job-item {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.job-info {
  flex: 1;
}

.job-info h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 5px;
}

.company {
  color: #2c3e50;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 10px;
}

.desc {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
  line-height: 1.5;
}

.date {
  color: #999;
  font-size: 12px;
}

.delete-btn {
  padding: 8px 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.delete-btn:hover {
  background: #c0392b;
}

.loading,
.no-jobs {
  text-align: center;
  padding: 40px;
  color: #666;
}

@media (max-width: 968px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }
}
</style>