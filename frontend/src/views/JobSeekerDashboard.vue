<template>
  <div class="dashboard">
    <nav class="navbar">
      <div class="nav-container">
        <h1>🔍 AUCA JobLink - Find Your Job</h1>
        <button @click="handleLogout" class="logout-btn">Logout</button>
      </div>
    </nav>

    <div class="container">
      <div class="content">
        <!-- Search Section -->
        <div class="section search-section">
          <h2>Search Jobs</h2>
          <input 
            v-model="searchQuery" 
            placeholder="Search by title, company, or location..."
            class="search-input"
          />
        </div>

        <!-- Available Jobs Section -->
        <div class="section">
          <h2>Available Jobs ({{ filteredJobs.length }})</h2>
          <p v-if="applyError" style="color: #e74c3c; background: #fadbd8; padding: 10px; border-radius: 5px;">{{ applyError }}</p>
          <div v-if="jobStore.loading" class="loading">Loading jobs...</div>
          <div v-else-if="filteredJobs.length === 0" class="no-jobs">
            No jobs available at the moment.
          </div>
          <div v-else class="jobs-grid">
            <JobCard 
              v-for="job in filteredJobs" 
              :key="job._id"
              :job="job"
              :show-delete="false"
              :show-apply="true"
              :applied-jobs="appliedJobs"
              @apply="handleApply"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useJobStore } from '../stores/jobStore';
import JobCard from '../components/JobCard.vue';

const router = useRouter();
const authStore = useAuthStore();
const jobStore = useJobStore();

const searchQuery = ref('');
const appliedJobs = ref([]);

const filteredJobs = computed(() => {
  if (!searchQuery.value) {
    return jobStore.jobs;
  }
  
  const query = searchQuery.value.toLowerCase();
  return jobStore.jobs.filter(job => 
    job.title.toLowerCase().includes(query) ||
    job.company.toLowerCase().includes(query) ||
    job.location.toLowerCase().includes(query)
  );
});

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/');
  }
  await jobStore.fetchJobs();
  try {
    const token = localStorage.getItem('token');
    const applied = await jobStore.fetchAppliedJobs(token);
    appliedJobs.value = applied.map(job => job._id);
  } catch (err) {
    console.error('Failed to fetch applied jobs:', err);
  }
});

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};

const applyError = ref('');

const handleApply = async (job) => {
  if (appliedJobs.value.includes(job._id)) return;
  try {
    const token = localStorage.getItem('token');
    await jobStore.applyToJob(job._id, token);
    appliedJobs.value.push(job._id);
  } catch (err) {
    applyError.value = err.response?.data?.message || 'Failed to apply';
    setTimeout(() => applyError.value = '', 3000);
  }
};
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f5f5f5;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.navbar h1 {
  margin: 0;
  font-size: 24px;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: white;
  color: #667eea;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.content {
  display: grid;
  gap: 30px;
}

.section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.section h2 {
  color: #333;
  margin-top: 0;
}

.search-section {
  margin-bottom: 10px;
}

.search-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
}

.loading,
.no-jobs {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
}

.jobs-grid {
  display: grid;
  gap: 20px;
}
</style>
