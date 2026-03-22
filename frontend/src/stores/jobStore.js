import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const useJobStore = defineStore('jobs', () => {
  const jobs = ref([]);
  const loading = ref(false);

  const fetchJobs = async () => {
    loading.value = true;
    try {
      const res = await axios.get(`${API}/getJobs`);
      jobs.value = res.data;
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      loading.value = false;
    }
  };

  const createJob = async (jobData, token) => {
    const res = await axios.post(`${API}/createJob`, jobData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    jobs.value.unshift(res.data);
    return res.data;
  };

  const deleteJob = async (jobId, token) => {
    await axios.delete(`${API}/deleteJob/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    jobs.value = jobs.value.filter(job => job._id !== jobId);
  };

  const applyToJob = async (jobId, token) => {
    const res = await axios.post(`${API}/applyToJob/${jobId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  };

  return { jobs, loading, fetchJobs, createJob, deleteJob, applyToJob };
});
