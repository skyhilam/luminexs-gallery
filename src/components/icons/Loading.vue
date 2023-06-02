<template>
  <div class="mask">
    <div class="loading"></div>
    <div class="text">加载中...</div>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading {
  width: 30px;
  height: 30px;
  border: 6px solid rgb(255, 255, 255);
  border-radius: 21px;
  border-left-color: transparent;
  animation: rotate 500ms infinite;
}

.text {
  margin-top: 8px;
  color: #ffffff;
}
</style>
