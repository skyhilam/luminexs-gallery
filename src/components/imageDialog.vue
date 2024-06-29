<template>
  <van-popup
    v-model="visible"
    ref="popup"
    class="w-full sm:max-w-[80vw] bg-white sm:rounded"
  >
    <loadingModule v-if="loading" />
    <div class="sm:h-[80vh] h-[100vh] max-h-full overflow-y-auto flex flex-col">
      <div class="flex item-center justify-between py-4 border-b border-black px-2">
        <h2>{{ title }}</h2>
        <button type="button" class="text-primary" @click="close"><XIcon /></button>
      </div>
      <div
        class="flex-grow overflow-y-auto overflow-x-hidden grid sm:grid-cols-5 grid-cols-3 gap-4 p-4"
      >
        <div
          class="relative aspect-square bg-gray-50"
          v-for="(item, index) of gallery"
          :key="index"
        >
          <input
            class="absolute top-4 right-4"
            type="checkbox"
            id="item.title"
            :value="item"
            v-model="images"
          />
          <img
            class="w-full h-full object-contain"
            :src="item.url"
            :alt="item.file_name"
            @click="selectImage(item)"
          />
        </div>
      </div>
      <div class="flex-0">
        <div class="px-2 py-4 ">
          <Pagination :meta="meta" @switched="fetch(collection, $event)" />
        </div>
        <div class="flex item-center justify-between border-t border-black py-4 px-2">
          <div class="flex space-x-4">
            <button
              class="bg-primary text-white px-4 py-2 rounded text-sm"
              @click="openSelecter"
            >
              上傳圖片
            </button>
            <button
              class="bg-primary text-white px-4 py-2 rounded text-sm"
              @click="deleteGallery"
              v-if="images.length != 0"
            >
              刪除圖片
            </button>
          </div>
          <div class="flex space-x-4">
            <button
              class="bg-primary text-white px-4 py-2 rounded text-sm"
              @click="submit"
              type="button"
            >
              确定
            </button>
            <button
              class="bg-primary text-white px-4 py-2 rounded text-sm hidden"
              @click="close"
              type="button"
            >
              取消
            </button>
          </div>
        </div>
        <vCropper
          :aspectRatio="0"
          v-if="file"
          :file="file"
          @cancel="cancel"
          @submit="upload"
        />
      </div>
    </div>
    <input
      type="file"
      accept="image/png,image/jpg,image/jpeg,image/webp"
      ref="file"
      class="hidden"
      @change="selected"
    />
  </van-popup>
</template>

<script>
import { first } from "lodash";
import vCropper from "@luminexs/components/image/ImageCropper.vue";
import { XIcon } from "@vue-hero-icons/outline";

import { serialize } from "object-to-formdata";
import loadingModule from "@luminexs/gallery/src/components/icons/Loading.vue";
import Pagination from "./Pagination.vue";
export default {
  components: { vCropper, loadingModule, XIcon, Pagination },
  props: {
    http: {
      type: Function,
      required: true,
    },
    title: {
      type: String,
      default: "選擇圖片",
    },
  },

  data() {
    return {
      visible: false,
      loading: false,
      aspectRatio: [1, 1],
      file: null,
      images: [],
      maxImages: 10,
      maxSize: 1080 * 2,
      gallery: [],
      meta: {},
      collection: "default",
    };
  },
  methods: {
    openSelecter() {
      this.$refs.file.click();
    },
    // 删除gallery
    async deleteGallery() {
      if (this.images.length === 0) return;
      try {
        this.loading = true;
        for (let item of this.images) {
          await this.http.delete(`api/gallery/${item.id}`);
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.images = [];
        this.fetch();
      }
    },
    // 獲取圖片
    async fetch(gallery, page) {
      if (gallery) this.collection = gallery;
      this.visible = true;
      try {
        this.loading = true;
        let { data } = await this.http.get("api/gallery", {
          params: {
            gallery: this.collection,
            page: page || 1,
          },
        });
        this.gallery = data.data;
        this.meta = data.meta;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },

    // 關閉
    close() {
      this.images = [];
      this.$refs.popup.close();
      this.$emit("close");
    },

    submit() {
      this.$emit("submit", this.images);
      this.close();
    },

    selectImage(image) {
      // check image is selected
      if (this.images.length > 0) {
        // 檢查是否已經選擇, 如果有則刪除
        for (let index = 0; index < this.images.length; index++) {
          if (this.images[index].id == image.id) {
            this.images.splice(index, 1);
            return;
          }
        }
      }

      console.log(this.images.length, this.maxImages);

      // check max images
      if (this.images.length >= this.maxImages) {
        alert("最多只能選擇" + this.maxImages + "張圖片");
        return;
      }

      // add image
      this.images.push(image);
    },

    // 選擇檔案
    selected(e) {
      const file = first(e.target.files);
      if (!file) return;
      this.file = file;
    },

    async upload(file) {
      try {
        this.loading = true;
        await this.http.post(
          "api/gallery",
          serialize({
            image: file,
            gallery: this.collection,
          })
        );
      } catch (e) {
        console.error(e);
      } finally {
        this.fetch();
        this.cancel();
      }
    },
    // 取消
    cancel() {
      this.file = null;
    },
  },
};
</script>

<style scoped></style>
