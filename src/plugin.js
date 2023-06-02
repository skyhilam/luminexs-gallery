import Vue from "vue";
import Dialog from "@luminexs/gallery/src/components/imageDialog.vue";

// get options
const options = <%= serialize(options) %>;

export default function ({ $axios }) {

  // 创建弹窗组件构造函数
  const ImageDialog = Vue.extend(Dialog);
  // 声明变量
  const global = {};

  // 图片弹窗索引
  global.flag = false;
  
  // 选择的图片集合
  global.imageList = [];

  // 打开图片弹窗
  global.open = function () {
    global.flag = true;
  };

  // 关闭图片弹窗
  global.close = function () {
    global.flag = false;
  };

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

  // 挂载自定义事件
  dialog.$on("closeDialog", (value) => {
    global.flag = value;
  });

  dialog.$on("getImageList", (value) => {
    global.flag = false;
    global.imageList = value;
  });

  document.body.append(dialog.$el);



  Vue.prototype.$gallery = global;
}
