<template>
  <div class="cropper" @keydown="keydown" contenteditable="true">
    <div class="cropper-shadow"></div>
    <div class="cropper-content">
      <div class="cropper-box">
        <div class="cropper-image">
          <img :src="src" alt="" />
          <button type="button" @click="contain">
            <ExpandIcon class="image-icon" />
          </button>
        </div>
        <div class="cropper-button">
          <div class="button-box">
            <button type="button" @click="submit">確定</button>
            <div></div>
            <button type="button" @click="cancel">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ExpandIcon from "./icons/ExpandIcon.vue";
import Cropperjs from "cropperjs";
import "cropperjs/dist/cropper.css";
export default {
  components: {
    ExpandIcon,
  },
  props: ["file", "aspectRatio", "maxSize"],

  data() {
    return {
      cropper: null,
      containsize: false,
    };
  },
  methods: {
    init() {
      // document.body.classList.add('on-fixed');
      const image = this.$el.querySelector("img");

      // 獲取圖片實際大小
      const img = new Image();
      img.src = image.src;
      img.onload = () => {
        const ratio = this.getRatio(img.width, img.height);
        this.initCropper(image, ratio);
      };
    },

    initCropper(image, ratio) {
      this.cropper = new Cropperjs(image, {
        aspectRatio: ratio,
        autoCropArea: 1,
        viewMode: 1,
        dragMode: "move",
        restore: false,
        guides: false,
        center: false,
        highlight: false,
        cropBoxMovable: false,
        cropBoxResizable: false,
        toggleDragModeOnDblclick: false,
        ready: () => {
          this.cropper.setCropBoxData({
            left: 0,
            top: 0,
            width: this.cropper.getContainerData().width,
            height: this.cropper.getContainerData().height,
          });
        },
      });
    },

    submit() {
      this.cropper
        .getCroppedCanvas({
          maxWidth: this.maxSize,
          maxHeight: this.maxSize,
          fillColor: "#fff",
          // imageSmoothingEnabled: true,
          // imageSmoothingQuality: "high",
        })
        .toBlob(
          (blob) => {
            this.$emit(
              "submit",
              new File([blob], this.file.name.replace(/(png|webp|jpg)/, "jpeg"))
            );
          },
          "image/jpeg",
          1
        );
    },
    cancel() {
      this.cropper.destroy();
      this.$emit("cancel");
    },
    contain() {
      this.containsize = !this.containsize;
      if (this.containsize) {
        this.replaceImageToContain();
      } else {
        this.reset();
      }
    },
    // 展開全圖片
    replaceImageToContain() {
      const cropper = this.cropper;
      const imageData = cropper.getImageData();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const cropboxData = cropper.getCropBoxData();
      const { aspectRatio, naturalWidth, naturalHeight } = imageData;
      // const size = this.maxSize ?? 1080;
      const r = this.getRatio(naturalWidth, naturalHeight); // 匯出的比例
      //r = w/h
      var x = 0,
        y = 0,
        w = naturalWidth, // 原圖寬
        h = naturalHeight, // 原圖高
        cw = Math.max(w, h),
        ch = cw;

      // r > 1是長方形圖
      if (r > 1) {
        ch = this.getHeight(cw, r, true);
      }

      // r < 1是長條形圖
      if (r < 1) {
        cw = this.getWidth(ch, r, true);
      }

      // 當原圖是長方形圖
      if (aspectRatio > 1) {
        w = Math.min(w, cw);
        h = this.getHeight(w, aspectRatio);

        // 當縮小後還大過相框
        if (h > ch) {
          h = ch;
          w = this.getWidth(h, aspectRatio);
        }
      }
      // 當原圖是長條形圖
      if (aspectRatio < 1) {
        h = Math.min(h, ch);
        w = this.getWidth(h, aspectRatio);

        // 當縮小後還大過相框
        if (w > cw) {
          w = cw;
          h = this.getHeight(w, aspectRatio);
        }
      }

      // 當原圖是正方形圖
      if (aspectRatio == 1) {
        w = Math.min(w, cw, h, ch);
        h = w;
      }

      y = Math.floor((ch - h) / 2);
      x = Math.floor((cw - w) / 2);

      // 圖框大小
      canvas.width = cw;
      canvas.height = ch;

      // 填白
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, cw, ch);

      // 填圖片
      ctx.drawImage(cropper.clear().getCroppedCanvas(), x, y, w, h);

      cropper.replace(canvas.toDataURL());
      cropper.setCropBoxData(cropboxData);
    },
    reset() {
      this.cropper.destroy();
      this.init();
    },

    getHeight(w, r, ceil = false) {
      if (ceil) return Math.ceil(w / r);
      return Math.floor(w / r);
    },
    getWidth(h, r, ceil = false) {
      if (ceil) return Math.ceil(h * r);
      return Math.floor(h * r);
    },
    keydown(e) {
      const keyCode = e.keyCode || e.which;
      if (keyCode === 13) {
        this.submit();
      }

      if (keyCode === 27) {
        this.cancel();
      }
    },

    // 計算比例
    getRatio(width, height) {
      if (this.aspectRatio == "auto") {
        return Math.floor(width / height);
      }
      return this.aspectRatio;
    },
  },
  computed: {
    src() {
      return URL.createObjectURL(this.file);
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style scoped>
.cropper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
}

.cropper-shadow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.6);
}

.cropper-content {
  position: relative;
  max-width: 968px;
  margin: auto;
  height: 100%;
  z-index: 20;
}

.cropper-box {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  border-top-width: 1px;
  border-bottom-width: 0px;
}

.cropper-image {
  position: relative;
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
}

.cropper-image img {
  display: block;
  max-width: 100%;
}

.cropper-image button {
  position: absolute;
  left: 32px;
  bottom: 32px;
  z-index: 50;
}

.cropper-image .image-icon {
  height: 32px;
}

.cropper-button {
  flex: none;
  width: 100%;
  height: 56px;
  flex-shrink: 1;
  background-color: #fff;
}

.button-box {
  display: flex;
  flex-direction: row;
  border-style: solid;
  border-color: #000;
  border-right-width: 0px;
  border-left-width: 1px;
  height: 100%;
}

.button-box button {
  color: #000;
  flex: 1 1 auto;
}
</style>
