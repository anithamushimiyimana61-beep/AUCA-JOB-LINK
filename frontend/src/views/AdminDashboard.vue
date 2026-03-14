<template>
  <div class="admin-dashboard">
    <nav class="navbar">
      <div class="nav-content">
        <div class="nav-left">
          <img src="/logo.png" alt="AUCA Logo" class="nav-logo" />
          <h1>Admin Dashboard</h1>
        </div>
        <button @click="logout" class="logout-btn">Logout</button>
      </div>
    </nav>

    <div class="container">
      <div class="tabs">
        <button @click="activeTab = 'companies'" :class="{active: activeTab === 'companies'}">Companies</button>
        <button @click="activeTab = 'jobs'" :class="{active: activeTab === 'jobs'}">Job Opportunities</button>
      </div>

      <!-- Companies Tab -->
      <div v-if="activeTab === 'companies'" class="tab-content">
        <div class="section">
          <h2>Add Company</h2>
          <div class="form-card">
            <p v-if="companySuccess" class="success">{{ companySuccess }}</p>
            <p v-if="companyError" class="error">{{ companyError }}</p>
            <input v-model="newCompany" placeholder="Company Name" />
            <button @click="addCompany" class="add-btn">Add Company</button>
          </div>
        </div>

        <div class="section">
          <h2>Companies List</h2>
          <div class="companies-list">
            <div v-for="(company, index) in companies" :key="index" class="company-item">
              <span>{{ company }}</span>
              <button @click="deleteCompany(index)" class="delete-btn">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Jobs Tab -->
      <div v-if="activeTab === 'jobs'" class="tab-content">
        <div class="section">
          <h2>Post Job Opportunity</h2>
          <div class="form-card">
            <p v-if="jobSuccess" class="success">{{ jobSuccess }}</p>
            <p v-if="jobError" class="error">{{ jobError }}</p>
            <input v-model="jobTitle" placeholder="Job Title" />
            <select v-model="jobCompany">
              <option value="">Select Company</option>
              <option v-for="(company, index) in companies" :key="index" :value="company">{{ company }}</option>
            </select>
            <input v-model="jobLocation" placeholder="Location (e.g., Kigali, Rwanda)" />
            <textarea v-model="jobDescription" placeholder="Job Description" rows="6"></textarea>
            <button @click="postJob" class="post-btn">Post Job</button>
          </div>
        </div>

        <div class="section">
          <h2>Posted Jobs</h2>
          <div v-if="loading" class="loading">Loading...</div>
          <div v-else class="jobs-list">
            <div v-for="job in jobs" :key="job._id" class="job-item">
              <div class="job-info">
                <h3>{{ job.title }}</h3>
                <p class="company">{{ job.company }}</p>
                <p class="location">📍 {{ job.location }}</p>
                <p class="desc">{{ job.description }}</p>
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
      activeTab: "companies",
      companies: ["Google", "Microsoft", "Amazon", "Apple", "Meta"],
      newCompany: "",
      companySuccess: "",
      companyError: "",
      jobTitle: "",
      jobCompany: "",
      jobLocation: "Kigali, Rwanda",
      jobDescription: "",
      jobs: [],
      loading: false,
      jobSuccess: "",
      jobError: ""
    };
  },
  async mounted() {
    await this.fetchJobs();
  },
  methods: {
    addCompany() {
      if (!this.newCompany.trim()) {
        this.companyError = "Company name required";
        return;
      }
      this.companies.push(this.newCompany);
      this.companySuccess = "Company added successfully!";
      this.newCompany = "";
      setTimeout(() => this.companySuccess = "", 3000);
    },
    deleteCompany(index) {
      if (confirm("Delete this company?")) {
        this.companies.splice(index, 1);
      }
    },
    async postJob() {
      try {
        this.jobError = "";
        this.jobSuccess = "";
        
        if (!this.jobTitle || !this.jobCompany || !this.jobDescription) {
          this.jobError = "All fields required";
          return;
        }

        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/jobs`,
          {
            title: this.jobTitle,
            company: this.jobCompany,
            location: this.jobLocation,
            description: this.jobDescription
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        
        this.jobSuccess = "Job posted successfully!";
        this.jobTitle = "";
        this.jobCompany = "";
        this.jobLocation = "Kigali, Rwanda";
        this.jobDescription = "";
        await this.fetchJobs();
      } catch (err) {
        this.jobError = "Failed to post job";
      }
    },
    async fetchJobs() {
      try {
        this.loading = true;
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs`);
        this.jobs = res.data;
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async deleteJob(id) {
      if (confirm("Delete this job?")) {
        try {
          await axios.delete(`${import.meta.env.VITE_API_URL}/api/jobs/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });
          await this.fetchJobs();
        } catch (err) {
          alert("Failed to delete");
        }
      }
    },
    logout() {
      localStorage.clear();
      this.$router.push("/admin-login");
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
  color: white;
}

.logout-btn {
  padding: 8px 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.logout-btn:hover {
  background: #c0392b;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.tabs button {
  padding: 12px 30px;
  background: white;
  border: 2px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
}

.tabs button.active {
  background: #2c3e50;
  color: white;
  border-color: #2c3e50;
}

.section {
  margin-bottom: 40px;
}

.section h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.form-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

input, select, textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
}

.add-btn, .post-btn {
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

.add-btn:hover, .post-btn:hover {
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

.companies-list, .jobs-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.company-item, .job-item {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.job-info {
  flex: 1;
}

.job-info h3 {
  font-size: 18px;
  margin-bottom: 5px;
}

.company {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 5px;
}

.location {
  color: #7f8c8d;
  font-size: 14px;
  margin-bottom: 10px;
}

.desc {
  color: #666;
  line-height: 1.5;
}

.delete-btn {
  padding: 8px 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete-btn:hover {
  background: #c0392b;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style>
