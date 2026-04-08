<template>
  <div class="overflow-x-auto">
    <div class="flex items-center justify-between">
      <p class="hidden text-sm text-gray-700 sm:block">
        由 <span class="font-medium">{{ meta.from }}</span>
        至 <span class="font-medium">{{ meta.to }}</span>
        共 <span class="font-medium">{{ meta.total }}</span> 結果
      </p>
      <ul
        class="flex items-center justify-center gap-1
               overflow-x-auto"
        role="navigation"
        aria-label="Pagination"
      >
        <!-- Previous -->
        <li>
          <button
            type="button"
            class="page-btn"
            :disabled="outOfBounds(meta.current_page - 1)"
            @click="switched(meta.current_page - 1)"
          >
            <ChevronLeftIcon class="h-4 w-4" />
          </button>
        </li>

        <!-- First page + ellipsis -->
        <template v-if="section > 1">
          <li>
            <button type="button" class="page-btn" @click="switched(1)">
              1
            </button>
          </li>
          <li class="px-1 text-gray-400">…</li>
        </template>

        <!-- Page numbers -->
        <li v-for="p in pages" :key="p">
          <button
            type="button"
            class="page-btn"
            :class="{ 'bg-primary text-white': p === meta.current_page }"
            @click="switched(p)"
          >
            {{ p }}
          </button>
        </li>

        <!-- Ellipsis + last page -->
        <template v-if="section < sections">
          <li class="px-1 text-gray-400">…</li>
          <li>
            <button
              type="button"
              class="page-btn"
              @click="switched(meta.last_page)"
            >
              {{ meta.last_page }}
            </button>
          </li>
        </template>

        <!-- Next -->
        <li>
          <button
            type="button"
            class="page-btn"
            :disabled="outOfBounds(meta.current_page + 1)"
            @click="switched(meta.current_page + 1)"
          >
            <ChevronRightIcon class="h-4 w-4" />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline';

import type { GalleryMeta } from '../types';

const PER_SECTION = 7;

const props = defineProps<{
  meta: GalleryMeta;
}>();

const emit = defineEmits<{
  switched: [page: number];
}>();

const section = computed(() =>
  Math.ceil(props.meta.current_page / PER_SECTION),
);

const sections = computed(() =>
  Math.ceil(props.meta.last_page / PER_SECTION),
);

const lastPageInSection = computed(() => {
  if (section.value === sections.value) return props.meta.last_page;
  return section.value * PER_SECTION;
});

const pages = computed(() => {
  const start = (section.value - 1) * PER_SECTION + 1;
  return Array.from(
    { length: lastPageInSection.value - start + 1 },
    (_, i) => start + i,
  );
});

function outOfBounds(page: number): boolean {
  return page < 1 || page > props.meta.last_page;
}

function switched(page: number): void {
  if (outOfBounds(page)) return;
  emit('switched', page);
}

onMounted(() => {
  if (props.meta.current_page > props.meta.last_page) {
    switched(props.meta.last_page);
  }
});
</script>

<style scoped>
.page-btn {
  @apply flex h-8 min-w-[2rem] items-center justify-center
         rounded border px-2 text-sm
         hover:bg-gray-100 disabled:cursor-not-allowed
         disabled:opacity-40 transition-colors;
}
</style>
