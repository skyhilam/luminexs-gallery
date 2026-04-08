import { defineNuxtPlugin } from '#app';

import { createGallery } from './composables/useGallery';

export default defineNuxtPlugin(() => {
  const gallery = createGallery();

  return {
    provide: {
      gallery,
    },
  };
});
