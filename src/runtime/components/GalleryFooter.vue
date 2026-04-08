<template>
  <div class="border-t bg-gray-50 px-4 py-3">
    <!-- Pagination row -->
    <GalleryPagination
      v-if="meta && meta.last_page > 1"
      :meta="meta"
      @switched="$emit('page', $event)"
    />

    <!-- Action row -->
    <div class="mt-2 flex items-center justify-between gap-2">
      <p class="text-sm text-gray-500">
        已選擇 {{ selectedCount }} 張
      </p>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="gallery-btn bg-white text-gray-700 border
                 hover:bg-gray-100"
          @click="$emit('upload')"
        >
          <ArrowUpTrayIcon class="h-4 w-4" />
          上傳
        </button>

        <button
          type="button"
          class="gallery-btn bg-red-50 text-red-600 border border-red-200
                 hover:bg-red-100 disabled:opacity-40"
          :disabled="!selectedCount"
          @click="$emit('delete')"
        >
          <TrashIcon class="h-4 w-4" />
          刪除
        </button>

        <button
          type="button"
          class="gallery-btn bg-primary text-white
                 hover:opacity-90 disabled:opacity-40"
          :disabled="!selectedCount"
          @click="$emit('submit')"
        >
          確定
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowUpTrayIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline';

import type { GalleryMeta } from '../types';
import GalleryPagination from './GalleryPagination.vue';

defineProps<{
  meta: GalleryMeta | null;
  selectedCount: number;
}>();

defineEmits<{
  page: [page: number];
  upload: [];
  delete: [];
  submit: [];
}>();
</script>

<style scoped>
.gallery-btn {
  @apply inline-flex items-center gap-1.5 rounded-md px-3 py-1.5
         text-sm font-medium transition-colors;
}
</style>
