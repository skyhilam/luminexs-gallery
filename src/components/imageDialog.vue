<template>
  <transition name="fade" mode="out-in">
    <div v-if="dialogInfo.flag" class="image-dialog">
      <loadingModule v-if="loading" />
      <div class="dialog-header">
        <div class="title">选择图片</div>
        <div class="close" @click="closeDialog"></div>
      </div>
      <div class="dialog-content">
        <div class="image-item" v-for="(item, index) of gallery" :key="index">
          <input type="checkbox" id="item.title" :value="item" v-model="selectImage" />
          <img :src="item.url" :alt="item.file_name" @click="clickImage(item)" />
        </div>
      </div>
      <div class="dialog-footer">
        <div>
          <a href="javascript:;" class="upload">
            上傳圖片
            <input
              type="file"
              accept="image/png,image/jpg,image/jpeg,image/webp"
              name="image"
              @change="selected"
            />
          </a>
          <button
            class="button"
            @click="deleteGallery"
            :disabled="selectImage.length == 0"
          >
            刪除圖片
          </button>
        </div>
        <div>
          <button class="button" @click="getImageList">确定</button>
          <button class="button" @click="closeDialog">取消</button>
        </div>
      </div>
      <vCropper
        :aspectRatio="aspectRatio"
        v-if="file"
        :file="file"
        @cancel="cancel"
        @submit="submit"
        :maxSize="maxSize"
      />
    </div>
  </transition>
</template>

<script>
import { first } from "lodash";
import vCropper from "@luminexs/gallery/src/components/ImageCropper.vue";
import { serialize } from "object-to-formdata";
import loadingModule from "@luminexs/gallery/src/components/icons/Loading.vue";
export default {
  props: {
    http: {
      type: Function,
      required: true,
    },
    title: {
      type: String,
      default: "选择图片",
    },
    dialogInfo: {
      type: Object,
      required: true,
    },
  },
  components: { vCropper, loadingModule },
  data() {
    return {
      loading: false,
      aspectRatio: [1, 1],
      file: null,
      selectImage: [],
      maxSize: 1080 * 2,
      gallery: [],
    };
  },
  methods: {
    // 删除gallery
    async deleteGallery() {
      if (this.selectImage.length === 0) return;
      try {
        this.loading = true;
        for (let item of this.selectImage) {
          await this.http.delete(`api/gallery/${item.id}`);
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.selectImage = [];
        this.getGallery();
      }
    },
    // 获取gallery
    async getGallery() {
      try {
        this.loading = true;
        let { data } = await this.http.get('api/gallery')
        this.gallery = data.data;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    closeDialog() {
      this.$emit("closeDialog", false);
    },
    getImageList() {
      this.$emit("getImageList", this.selectImage);
    },
    clickImage(image) {
      // 點擊圖片判斷是否選擇圖片，默認為未選中
      let flag = false;
      for (let index = 0; index < this.selectImage.length; index++) {
        if (this.selectImage[index].id == image.id) {
          // 點擊圖片已選擇則將圖片移除
          flag = true;
          this.selectImage.splice(index, 1);
        }
      }
      // 點擊圖片未選擇則添加圖片
      if (!flag) {
        this.selectImage.push(image);
      }
    },
    // 選擇檔案
    selected(e) {
      const file = first(e.target.files);
      if (!file) return;
      this.file = file;
    },
    async submit(file) {
      try {
        this.loading = true;
        await this.http.post("api/gallery", serialize({
          image: file,
        }));
      } catch (e) {
        console.error(e);
      } finally {
        this.getGallery();
        this.cancel();
      }
    },
    // 取消
    cancel() {
      this.file = null;
    },
  },
  mounted() {
    this.getGallery();
  },
};
</script>

<style scoped>
.image-dialog {
  z-index: 999;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  min-width: 600px;
  min-height: 300px;
  background-color: white;
}

.dialog-header {
  display: flex;
  flex-grow: 0;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #000;
}

.dialog-content {
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  overflow: auto;
  padding: 10px;
}

.image-item {
  position: relative;
  margin: 10px;
  width: 200px;
  height: 100px;
  border: 1px solid rgba(0, 0, 0, 0.5);
}

.image-item img {
  width: 100%;
  height: 100%;
}

.image-item input {
  z-index: 10;
  position: absolute;
  top: 2px;
  right: 2px;
}

.dialog-footer {
  display: flex;
  flex-grow: 0;
  justify-content: space-between;
  padding: 10px;
  border-top: 1px solid #000;
}

.upload {
  position: relative;
  text-decoration: none;
  padding: 5px 8px;
  border: 1px solid #000;
  margin: 0px 4px;
}

.upload input {
  position: absolute;
  overflow: hidden;
  right: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}

.button {
  display: inline-block;
  margin: 0px 4px;
  padding: 4px 8px;
  border: 1px solid #000;
}

.title {
  font-size: 18px;
}

.close {
  position: relative;
  cursor: pointer;
  width: 20px;
  height: 20px;
}

.close::before {
  content: "";
  display: block;
  position: absolute;
  top: 14px;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #000;
  transform: rotate(-45deg);
}

.close::after {
  content: "";
  display: block;
  position: absolute;
  top: 14px;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #000;
  transform: rotate(45deg);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease-in;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
