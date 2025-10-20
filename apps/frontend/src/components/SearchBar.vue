<script setup lang="ts">
import { ref } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const searchQuery = ref('')

const emit = defineEmits<{
  search: [query: string]
}>()

const handleSearch = () => {
  emit('search', searchQuery.value)
}
</script>

<template>
  <div class="search-bar">
    <MagnifyingGlassIcon class="search-icon" />
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search Pokemon"
      @input="handleSearch"
    />
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 8px;
  background: #EFF0F1;
  border-radius: 10px;
  height: 36px;
}

.search-icon {
  width: 16px;
  height: 16px;
  color: rgba(60, 60, 67, 0.6);
  flex-shrink: 0;
}

input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 17px;
  line-height: 22px;
  letter-spacing: -0.408px;
  color: #3c3c43;
}

input::placeholder {
  color: rgba(60, 60, 67, 0.6);
}
</style>
