<script setup lang="ts">
interface Props {
  title?: string
  message: string
  showRetry?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Error',
  showRetry: false
})

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="flex-1 flex items-center justify-center px-4">
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
      <p class="font-bold">{{ title }}</p>
      <p>{{ message }}</p>
      <button 
        v-if="showRetry"
        @click="emit('retry')"
        class="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
</template>
