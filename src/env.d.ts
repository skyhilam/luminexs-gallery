/**
 * Type declarations for @luminexs/gallery.
 * Provides ambient types for external modules used at runtime.
 */

// Nuxt auto-imports
declare module '#app' {
  interface NuxtApp {
    $gallery: import('./runtime/types').GalleryInstance;
  }
}

declare module '#imports' {
  export function useGallery(): import('./runtime/types').GalleryInstance;
}

// External peer dependencies
declare module 'object-to-formdata' {
  export function serialize(
    obj: Record<string, unknown>,
    cfg?: Record<string, unknown>,
    fd?: FormData,
    pre?: string,
  ): FormData;
}

declare module '@luminexs/tools/components/image/ImageCropper.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<
    { file: File; aspectRatio: number; maxSize?: number },
    Record<string, never>,
    unknown
  >;
  export default component;
}

// Augment Nuxt runtime config
declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    gallery: {
      url: string;
      token: string;
    };
  }
}

export {};
