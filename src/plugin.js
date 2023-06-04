import Vue from "vue";
import Dialog from "@luminexs/gallery/src/components/imageDialog.vue";

// get options
const options = <%= serialize(options) %>;

export default function ({ $axios }) {

  // 创建弹窗组件构造函数
  const ImageDialog = Vue.extend(Dialog);



  // 创建组件实例
  const dialog = new ImageDialog({
    propsData: {
      dialogInfo: global,
      http: $axios.create({
        baseURL: 'https://luminexs.com',
        headers: {
          Authorization: `Bearer ${options.token}`,
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        withCredentials: true,
      }),
    },
  }).$mount();


  dialog.$on('close', function () {
    gallery.close();
  });

  dialog.$on('submit', function (data) {
    gallery.selectedImages(data);
  });




  const gallery = {
    images: [],

    open() {
      // 将组件实例挂载到body上
      document.body.appendChild(dialog.$el);

      // 獲取圖片列表
      dialog.fetch();

      return new Promise(resolve => {
        dialog.$once('submit', function (data) {
          resolve(data);
        });
      });
    },

    close() {
      if (document.body.contains(dialog.$el))
        document.body.removeChild(dialog.$el);
    },

    selectedImages(data) {
      this.images = data;
    }

  }



  Vue.prototype.$gallery = gallery;
}
