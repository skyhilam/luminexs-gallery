<template>
  <Teleport to="body">
    <div
      v-if="state.visible"
      class="fixed inset-0 z-[9999] flex items-center justify-center
             bg-black/40 backdrop-blur-sm"
      @click.self="close"
    >
      <div
        class="relative w-full sm:max-w-[80vw] sm:h-[80vh] h-full
               max-h-full bg-white sm:rounded-lg overflow-hidden
               flex flex-col shadow-xl"
      >
        <!-- Loading overlay -->
        <div v-if="loading"
          class="absolute inset-0 z-50 flex items-center justify-center bg-black/20">
          <div class="h-8 w-8 animate-spin rounded-full
                      border-4 border-white border-t-transparent" />
        </div>
        <!-- Header -->
        <div class="flex items-center justify-between border-b px-4 py-3">
          <h2 class="text-lg font-medium">{{ state.title }}</h2>
          <button type="button" class="text-gray-500 hover:text-gray-800" @click="close">
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>

        <!-- Image grid -->
        <div class="flex-grow overflow-y-auto p-4 grid grid-cols-3 sm:grid-cols-5 gap-4">
          <div v-for="img in gallery" :key="img.id"
            class="relative aspect-square bg-gray-50 rounded cursor-pointer
                   overflow-hidden ring-2 ring-offset-1 transition-all"
            :class="isSelected(img) ? 'ring-primary' : 'ring-transparent'"
            @click="toggleImage(img)">
            <img :src="img.url" :alt="img.file_name" loading="lazy"
              class="h-full w-full object-contain" />
            <div v-if="isSelected(img)"
              class="absolute right-1 top-1 flex h-5 w-5 items-center
                     justify-center rounded-full bg-primary text-[10px] text-white">✓</div>
          </div>
        </div>

        <!-- Footer -->
        <GalleryFooter
          :meta="meta" :selected-count="selected.length"
          @page="fetchPage" @upload="openFilePicker"
          @delete="deleteSelected" @submit="submit"
        />

        <input ref="fileInput" type="file" class="hidden"
          accept="image/png,image/jpg,image/jpeg,image/webp"
          @change="onFileSelected" />

        <ImageCropper
          v-if="cropFile" :file="cropFile" :aspect-ratio="0"
          :max-size="state.maxSize"
          @cancel="cropFile = null" @submit="uploadCropped"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

import type { GalleryImage, GalleryMeta } from '../types';
import { getGalleryState } from '../composables/useGallery';
import { deleteImages, fetchGallery, uploadImage } from '../composables/galleryApi';
import GalleryFooter from './GalleryFooter.vue';
import ImageCropper from '@luminexs/tools/components/image/ImageCropper.vue';

const state = getGalleryState();
const loading = ref(false);
const gallery = ref<GalleryImage[]>([]);
const meta = ref<GalleryMeta | null>(null);
const selected = ref<GalleryImage[]>([]);
const cropFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement>();

watch(() => state.value.visible, (vis) => { if (vis) fetchPage(1); });

async function fetchPage(page: number): Promise<void> {
  loading.value = true;
  try {
    const res = await fetchGallery(state.value.collection, page);
    gallery.value = res.data;
    meta.value = res.meta;
  } catch (e) { console.error('[gallery] fetch failed', e); }
  finally { loading.value = false; }
}

function isSelected(img: GalleryImage): boolean {
  return selected.value.some((s) => s.id === img.id);
}

function toggleImage(img: GalleryImage): void {
  const idx = selected.value.findIndex((s) => s.id === img.id);
  if (idx !== -1) { selected.value.splice(idx, 1); return; }
  if (selected.value.length >= state.value.maxImages) {
    alert(`最多只能選擇 ${state.value.maxImages} 張圖片`);
    return;
  }
  selected.value.push(img);
}

async function deleteSelected(): Promise<void> {
  if (!selected.value.length) return;
  loading.value = true;
  try { await deleteImages(selected.value); }
  catch (e) { console.error('[gallery] delete failed', e); }
  finally { selected.value = []; await fetchPage(1); }
}

function submit(): void {
  state.value.resolve?.(selected.value.length ? [...selected.value] : null);
  cleanup();
}

function close(): void { state.value.resolve?.(null); cleanup(); }

function cleanup(): void {
  Object.assign(state.value, { visible: false, resolve: null });
  selected.value = [];
  gallery.value = [];
  meta.value = null;
  cropFile.value = null;
}

function openFilePicker(): void { fileInput.value?.click(); }

function onFileSelected(e: Event): void {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  cropFile.value = file;
  if (fileInput.value) fileInput.value.value = '';
}

async function uploadCropped(file: File): Promise<void> {
  loading.value = true;
  try { await uploadImage(file, state.value.collection); }
  catch (e) { console.error('[gallery] upload failed', e); }
  finally { cropFile.value = null; await fetchPage(1); }
}
</script>
