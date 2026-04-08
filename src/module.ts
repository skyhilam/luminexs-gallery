import {
  addComponent,
  addImports,
  addPlugin,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit';

import type { GalleryModuleOptions } from './runtime/types';

export default defineNuxtModule<GalleryModuleOptions>({
  meta: {
    name: '@luminexs/gallery',
    configKey: 'gallery',
    compatibility: {
      nuxt: '^3.10.0',
    },
  },
  defaults: {
    url: 'https://luminexs.com',
    token: '',
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    // Provide runtime config so the plugin can read url + token
    nuxt.options.runtimeConfig.public.gallery = {
      url: options.url ?? 'https://luminexs.com',
      token: options.token ?? '',
    };

    // Register plugin (provides $gallery + useGallery)
    addPlugin(resolve('./runtime/plugin'));

    // Auto-import the composable
    addImports({
      name: 'useGallery',
      from: resolve('./runtime/composables/useGallery'),
    });

    // Auto-register gallery components
    addComponent({
      name: 'GalleryDialog',
      filePath: resolve('./runtime/components/GalleryDialog.vue'),
    });

    addComponent({
      name: 'GalleryPagination',
      filePath: resolve('./runtime/components/GalleryPagination.vue'),
    });
  },
});
