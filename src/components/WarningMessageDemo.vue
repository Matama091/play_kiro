<script setup lang="ts">
/**
 * Demo component to test WarningMessage functionality
 * This is a temporary component for verification purposes
 */
import { ref } from 'vue';
import WarningMessage from './WarningMessage.vue';

const showWarning = ref(false);
const warningMessage = ref('家づくりを前向きに進めるか検討する時間です');
const considerationItems = ref([
  '次回も商談を行うかどうか',
  'その日にちはいつにするか'
]);

const triggerWarning = () => {
  showWarning.value = true;
};

const closeWarning = () => {
  showWarning.value = false;
};
</script>

<template>
  <div class="demo-container">
    <h2>WarningMessage Component Demo</h2>
    <button @click="triggerWarning" class="demo-button">
      5分警告を表示
    </button>
    
    <WarningMessage
      :show="showWarning"
      :message="warningMessage"
      :consideration-items="considerationItems"
      type="warning"
      @close="closeWarning"
    />
  </div>
</template>

<style scoped>
.demo-container {
  padding: 2rem;
  text-align: center;
}

.demo-button {
  background: var(--color-warning);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.demo-button:hover {
  background: #e68900;
}
</style>