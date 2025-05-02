import 'element-plus/theme-chalk/index.css';       // ← 默认浅色变量
import 'element-plus/theme-chalk/dark/css-vars.css'; // ← 深色变量集
import 'element-plus/dist/index.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus, {ElIcon} from 'element-plus';
import Markdown from 'vue3-markdown-it';
import * as Icons from '@element-plus/icons-vue'

import backend from '@/request/base.ts'

import App from './App.vue'
import router from './router'

const mq = window.matchMedia('(prefers-color-scheme: dark)');
const html = document.documentElement;

// 初始状态
html.classList.toggle('dark', mq.matches);

// 监听系统切换
mq.addEventListener('change', e => {
  html.classList.toggle('dark', e.matches);
});


const app = createApp(App)

app.config.globalProperties.$axios = backend
app.provide('axios', backend)

app.use(createPinia())
app.use(router)
app.use(ElementPlus, {} as any)
// 注册容器
app.component(<string>ElIcon.name, ElIcon)
// 注册所有图标
Object.entries(Icons).forEach(([name, component]) => {
  app.component(name, component)
})
app.use(Markdown)

app.mount('#app')
