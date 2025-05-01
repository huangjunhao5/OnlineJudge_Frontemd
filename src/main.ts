import 'element-plus/theme-chalk/index.css';       // ← 默认浅色变量
import 'element-plus/theme-chalk/dark/css-vars.css'; // ← 深色变量集
import 'element-plus/dist/index.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus';
import Markdown from 'vue3-markdown-it';

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
app.use(Markdown)

app.mount('#app')
