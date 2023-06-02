# @luminexs/gallery

## Installation

1. Add the following line to the `devDependencies` with your package manager:

```shell
# Using npm
npm install @luminexs/gallery --save-dev
```

2. Add `@luminexs/gallery` to the `modules` section of `nuxt.config.js`
```js
{
  modules: [
    ['@luminexs/gallery', {
      token: "your token"
    }], 
  ],
}
```


## 🚀 Usage
1. Open gallery
```js
this.$gallery.open()
```