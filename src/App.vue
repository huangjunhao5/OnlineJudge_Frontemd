<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
import NavBar from "@/components/NavBar.vue";
</script>

<template>
  <div>
    <NavBar class="nav-list-app"/>
    <div class="route">
      <div class="space"/>
      <RouterView/>
    </div>
  </div>


</template>

<style scoped>

.route {
  //margin-top: 6em;
  width: 100%;
}
.space{
  height: 6em;
}

.nav-list-app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0 0;
  padding-top: 2em;

  position: fixed;           /* 元素脱离文档流 */
  top: 0;                    /* 贴顶 */
  display: flex;
  left: 0;                   /* 贴左 */
  justify-content: flex-start; /* 内容左对齐 */
  width: 100%;               /* 铺满宽度 */
  z-index: 1000;             /* 保证覆盖其他内容 */
}


</style>
