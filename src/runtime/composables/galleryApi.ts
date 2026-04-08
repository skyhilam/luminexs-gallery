/**
 * Gallery API helper — encapsulates all HTTP calls to the gallery backend.
 * Keeps the GalleryDialog.vue under 150 lines.
 */
import { serialize } from 'object-to-formdata';

import type { GalleryApiResponse, GalleryImage } from '../types';

function readRuntimeConfig(key: string): string {
  try {
    type NuxtGlobal = { config?: { public?: { gallery?: Record<string, string> } } };
    const cfg = (globalThis as Record<string, unknown>).__NUXT__ as NuxtGlobal | undefined;
    return cfg?.config?.public?.gallery?.[key] ?? '';
  } catch {
    return '';
  }
}

function getBaseUrl(): string {
  return readRuntimeConfig('url') || 'https://luminexs.com';
}

function buildHeaders(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };
  const token = readRuntimeConfig('token');
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

function apiUrl(path: string): string {
  return `${getBaseUrl().replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

export async function fetchGallery(
  collection: string,
  page: number,
): Promise<GalleryApiResponse> {
  const url = apiUrl(`api/gallery?gallery=${collection}&page=${page}`);
  const res = await fetch(url, { headers: buildHeaders() });
  return (await res.json()) as GalleryApiResponse;
}

export async function deleteImage(id: number): Promise<void> {
  await fetch(apiUrl(`api/gallery/${id}`), {
    method: 'DELETE',
    headers: buildHeaders(),
  });
}

export async function uploadImage(
  file: File,
  collection: string,
): Promise<void> {
  const body = serialize({ image: file, gallery: collection });
  await fetch(apiUrl('api/gallery'), {
    method: 'POST',
    headers: buildHeaders(),
    body,
  });
}

export async function deleteImages(
  images: GalleryImage[],
): Promise<void> {
  for (const img of images) {
    await deleteImage(img.id);
  }
}
