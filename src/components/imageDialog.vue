<template>
  <modal contentClass="my-8 w-full max-w-screen-xl p-6">
    <div class="h-[80vh] bg-white w-full flex flex-col">
      <loadingModule v-if="loading" />
      <div class="flex item-center justify-between py-4 border-b border-black">
        <h1 class="text-lg">選擇圖片</h1>
        <button type="button" @click="close"><XIcon /></button>
      </div>
      <div
        class="flex-grow overflow-y-auto overflow-x-hidden grid sm:grid-cols-5 grid-cols-3 gap-4 py-4"
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
      <div class="my-4 ">
        <Pagination :meta="meta" @switched="fetch(collection, $event)" />
      </div>
      <div class="flex item-center justify-between border-t border-black py-4">
        <div class="flex space-x-4">
          <button class="btn" @click="openSelecter">上傳圖片</button>
          <button class="btn" @click="deleteGallery" :disabled="images.length == 0">
            刪除圖片
          </button>
        </div>
        <div class="flex space-x-4">
          <button class="btn" @click="submit" type="button">确定</button>
          <button class="btn" @click="close" type="button">取消</button>
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
    <input
      type="file"
      accept="image/png,image/jpg,image/jpeg,image/webp"
      ref="file"
      class="hidden"
      @change="selected"
    />
  </modal>
</template>

<script>
import { first } from "lodash";
import vCropper from "@luminexs/components/image/ImageCropper.vue";
import { XIcon } from "@vue-hero-icons/outline";
import Modal from "@luminexs/components/modal/Modal.vue";
import { serialize } from "object-to-formdata";
import loadingModule from "@luminexs/gallery/src/components/icons/Loading.vue";
import Pagination from "./Pagination.vue";
export default {
  components: { vCropper, loadingModule, Modal, XIcon, Pagination },
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
      loading: false,
      aspectRatio: [1, 1],
      file: null,
      images: [],
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
    close() {
      this.images = [];
      this.$emit("close");
    },

    submit() {
      this.$emit("submit", this.images);
      this.close();
    },

    selectImage(image) {
      // check image is selected
      if (this.images.length > 0) {
        for (let index = 0; index < this.images.length; index++) {
          if (this.images[index].id == image.id) {
            this.images.splice(index, 1);
            return;
          }
        }
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
