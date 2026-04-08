/**
 * useGallery — composable for the gallery image picker.
 *
 * Opens a dialog overlay for browsing / uploading / selecting images,
 * then resolves with the selected images or null on cancel.
 */
import { createApp, h, ref } from 'vue';

import type {
  GalleryImage,
  GalleryInstance,
  GalleryOpenOptions,
} from '../types';

import GalleryDialog from '../components/GalleryDialog.vue';

/**
 * Reactive state shared between the composable and the dialog component.
 * This avoids manual DOM manipulation (no more `document.body.appendChild`).
 */
export interface GalleryState {
  visible: boolean;
  collection: string;
  title: string;
  maxImages: number;
  maxSize: number;
  resolve: ((value: GalleryImage[] | null) => void) | null;
}

const state = ref<GalleryState>({
  visible: false,
  collection: 'default',
  title: '選擇圖片',
  maxImages: 10,
  maxSize: 2160,
  resolve: null,
});

export function getGalleryState() {
  return state;
}

export function createGallery(): GalleryInstance {
  let mounted = false;

  function ensureMounted(): void {
    if (mounted || typeof document === 'undefined') return;
    mounted = true;

    const host = document.createElement('div');
    host.id = 'luminexs-gallery-host';
    document.body.appendChild(host);

    const app = createApp({
      render: () => h(GalleryDialog),
    });
    app.mount(host);
  }

  return {
    open(
      collection = 'default',
      options?: GalleryOpenOptions,
    ): Promise<GalleryImage[] | null> {
      ensureMounted();

      return new Promise((resolve) => {
        state.value = {
          visible: true,
          collection,
          title: options?.title ?? '選擇圖片',
          maxImages: options?.maxImages ?? 10,
          maxSize: options?.maxSize ?? 2160,
          resolve,
        };
      });
    },
  };
}

/**
 * Composable hook — usable in any Vue 3 component or Nuxt page.
 */
export function useGallery(): GalleryInstance {
  return createGallery();
}
