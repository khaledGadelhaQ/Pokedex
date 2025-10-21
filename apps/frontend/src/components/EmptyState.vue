<script setup lang="ts">
interface Props {
  title: string
  message: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex-1 flex items-center justify-center px-4">
    <div class="text-center">
      <p class="text-xl font-bold text-dark-1 mb-2">
        {{ title }}
      </p>
      <p class="text-grey-1">
        {{ message }}
      </p>
    </div>
  </div>
</template>
