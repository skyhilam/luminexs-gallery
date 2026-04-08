/**
 * Type definitions for @luminexs/gallery.
 */

export interface GalleryImage {
  id: number;
  url: string;
  file_name: string;
  collection?: string;
}

export interface GalleryMeta {
  from: number;
  to: number;
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}

export interface GalleryApiResponse {
  data: GalleryImage[];
  meta: GalleryMeta;
}

export interface GalleryModuleOptions {
  /** Base URL for the gallery API (default: 'https://luminexs.com') */
  url?: string;
  /** Bearer token for authentication */
  token?: string;
}

export interface GalleryOpenOptions {
  /** Max number of images that can be selected (default: 10) */
  maxImages?: number;
  /** Max image dimension for cropper (default: 2160) */
  maxSize?: number;
  /** Dialog title (default: '選擇圖片') */
  title?: string;
}

export interface GalleryInstance {
  open(
    collection?: string,
    options?: GalleryOpenOptions,
  ): Promise<GalleryImage[] | null>;
}
