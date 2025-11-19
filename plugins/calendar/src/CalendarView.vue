<script setup lang="ts">
import { ref, computed } from 'vue';

const currentDate = ref(new Date());

const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  return new Date(year, month + 1, 0).getDate();
});

const firstDayOfMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  return new Date(year, month, 1).getDay();
});

const monthName = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' });
});

const days = computed(() => {
  const result = [];
  for (let i = 0; i < firstDayOfMonth.value; i++) {
    result.push(null);
  }
  for (let i = 1; i <= daysInMonth.value; i++) {
    result.push(i);
  }
  return result;
});

function prevMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
}
</script>

<template>
  <div class="calendar-view">
    <div class="calendar-header">
      <button @click="prevMonth" class="calendar-nav">&lt;</button>
      <h2 class="calendar-title">{{ monthName }}</h2>
      <button @click="nextMonth" class="calendar-nav">&gt;</button>
    </div>
    
    <div class="calendar-grid">
      <div class="calendar-day-header">Sun</div>
      <div class="calendar-day-header">Mon</div>
      <div class="calendar-day-header">Tue</div>
      <div class="calendar-day-header">Wed</div>
      <div class="calendar-day-header">Thu</div>
      <div class="calendar-day-header">Fri</div>
      <div class="calendar-day-header">Sat</div>
      
      <div 
        v-for="(day, index) in days" 
        :key="index" 
        class="calendar-day"
        :class="{ 'calendar-day--empty': day === null }"
      >
        <span v-if="day">{{ day }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-view {
  height: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.calendar-title {
  font-size: 1.25rem;
  font-weight: 600;
}

.calendar-nav {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  cursor: pointer;
  color: var(--color-text);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: var(--color-border);
  border: 1px solid var(--color-border);
  flex: 1;
}

.calendar-day-header {
  background-color: var(--color-bg);
  padding: 0.5rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.calendar-day {
  background-color: var(--color-bg);
  padding: 0.5rem;
  min-height: 3rem;
}

.calendar-day--empty {
  background-color: var(--color-sidebar-bg);
}
</style>
