<template>
  <div>
    <JobSeekerDashboard v-if="role === 'student' || role === 'job_seeker'" />
    <EmployerDashboard v-else-if="role === 'employer'" />
    <div v-else class="loading">Redirecting...</div>
  </div>
</template>

<script>
import JobSeekerDashboard from './JobSeekerDashboard.vue';
import EmployerDashboard from './EmployerDashboard.vue';

export default {
  components: { JobSeekerDashboard, EmployerDashboard },
  computed: {
    role() {
      return localStorage.getItem('role');
    }
  },
  mounted() {
    if (!localStorage.getItem('token')) {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 18px;
  color: #666;
}
</style>
