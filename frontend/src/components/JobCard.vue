<template>
  <div class="job-card">
    <div class="job-header">
      <div>
        <h3>{{ job.title }}</h3>
        <p class="company">{{ job.company }}</p>
      </div>
      <button v-if="showDelete" @click="handleDelete" class="delete-btn">Delete</button>
    </div>
    
    <p class="location">📍 {{ job.location }}</p>
    
    <p class="description">{{ job.description }}</p>

    <div class="job-details">
      <div v-if="job.salary" class="detail-item">
        <span class="label">💰 Salary:</span>
        <span>{{ job.salary }}</span>
      </div>
      <div v-if="job.jobType" class="detail-item">
        <span class="label">📌 Type:</span>
        <span class="job-type">{{ job.jobType }}</span>
      </div>
      <div v-if="job.minGrade" class="detail-item">
        <span class="label">📚 Min Grade:</span>
        <span class="grade">{{ job.minGrade }}/20</span>
      </div>
    </div>

    <div v-if="job.requirements && job.requirements.length > 0" class="section">
      <h4>Key Requirements</h4>
      <div class="tags">
        <span v-for="(req, idx) in job.requirements" :key="`req-${idx}`" class="tag req-tag">
          {{ req }}
        </span>
      </div>
    </div>

    <div v-if="job.skills && job.skills.length > 0" class="section">
      <h4>Desired Skills</h4>
      <div class="tags">
        <span v-for="(skill, idx) in job.skills" :key="`skill-${idx}`" class="tag skill-tag">
          {{ skill }}
        </span>
      </div>
    </div>

    <div class="job-footer">
      <span class="date">{{ formatDate(job.createdAt) }}</span>
      <button v-if="showApply && !isApplied" @click="handleApply" class="apply-btn">Apply Now</button>
      <button v-if="showApply && isApplied" class="done-btn" disabled>DONE</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  job: {
    type: Object,
    required: true
  },
  showDelete: {
    type: Boolean,
    default: false
  },
  showApply: {
    type: Boolean,
    default: false
  },
  appliedJobs: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['delete', 'apply']);

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this job?')) {
    emit('delete', props.job._id);
  }
};

const handleApply = () => {
  emit('apply', props.job);
};

const isApplied = computed(() => {
  return props.appliedJobs.includes(props.job._id);
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>

<style scoped>
.job-card {
  border: 1px solid #e0e0e0;
  padding: 20px;
  margin: 15px 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  background: #fff;
  transition: all 0.3s ease;
}

.job-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border-color: #667eea;
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.job-header h3 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 1.2em;
}

.company {
  margin: 0;
  font-weight: 600;
  color: #667eea;
  font-size: 0.95em;
}

.location {
  color: #666;
  margin: 8px 0;
  font-size: 0.95em;
}

.description {
  color: #333;
  margin: 12px 0;
  line-height: 1.5;
  font-size: 0.95em;
}

.job-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
  margin: 15px 0;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 6px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-weight: 600;
  color: #555;
  font-size: 0.85em;
}

.job-type {
  display: inline-block;
  padding: 4px 8px;
  background: #667eea;
  color: white;
  border-radius: 4px;
  font-size: 0.85em;
  font-weight: 500;
  width: fit-content;
}

.grade {
  color: #2e7d32;
  font-weight: 600;
  font-size: 0.95em;
}

.section {
  margin: 15px 0;
}

.section h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 0.95em;
  font-weight: 600;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 500;
}

.req-tag {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #90caf9;
}

.skill-tag {
  background: #f3e5f5;
  color: #7b1fa2;
  border: 1px solid #ce93d8;
}

.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.date {
  color: #999;
  font-size: 0.85em;
}

.delete-btn {
  background: #ff4444;
  color: white;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.85em;
  font-weight: 500;
  transition: background 0.3s;
}

.delete-btn:hover {
  background: #cc0000;
}

.apply-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 20px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: 600;
  transition: all 0.3s;
}

.apply-btn:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.done-btn {
  background: #27ae60;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: 600;
  cursor: not-allowed;
  opacity: 0.8;
}

.applied-badge {
  background: #27ae60;
  color: white;
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
</style>
