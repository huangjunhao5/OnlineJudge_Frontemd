<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {getCookie, setCookie} from "@/lib/cookie.js";

// 基础导航链接
const baseLinks = ref([
  { name: '首页', path: '/' },
  { name: '题目列表', path: '/problems' },
  { name: '提交列表', path: '/submissions' },
  { name: 'About', path: '/about' }
])

// 下拉菜单显示控制
const showDropdown = ref(false)

// 用户状态
const token = ref('')
const username = ref('')
const userStore = useUserStore()

// Vue Router 实例，用于编程式导航
const router = useRouter()

// 显示名称

const displayName = computed(() => {
  return getLoginUser() || '用户未登录'
})

// 菜单项
const menuItems = computed(() => {
  if (getLoginUser()) {
    return [
      { name: '用户详情', path: '/user', action: null },
      { name: '退出登录', path: null, action: 'logout' }
    ]
  } else {
    return [
      { name: '登录', path: '/login', action: null },
      { name: '注册', path: '/register', action: null }
    ]
  }
})

function getLoginUser(){

  if (userStore.username) {
    username.value = userStore.username
  }
  return username.value
}

// 退出登录逻辑
function logout() {
  setCookie('token', '', -1)
  setCookie('username', '', -1)
  userStore.clearUser()
  token.value = ''
  username.value = ''
  window.location.reload()
}

// 点击菜单项
function onMenuItemClick(item) {
  if (item.action === 'logout') {
    logout()
  }
  // 有 path 时才跳转
  else if (item.path) {
    router.push(item.path)
  }
}

// 挂载时获取用户信息
onMounted(() => {
  token.value = getCookie('token')
  if (token.value) {
    username.value = getCookie('username')
  }
})
</script>

<template>
  <nav :class="['navbar']">
    <ul class="nav-list">
      <li class="li-space"/>
      <!-- 普通导航链接 -->
      <li
        v-for="link in baseLinks"
        :key="link.path"
        class="nav-item root"
      >
        <RouterLink
          :to="link.path"
          class="nav-link"
          active-class="active"
        >
          {{ link.name }}
        </RouterLink>
      </li>

      <!-- 用户下拉菜单 -->
      <li
        class="nav-item dropdown root"
        @mouseenter="showDropdown = true"
        @mouseleave="showDropdown = false"
      >
        <span class="nav-link dropdown-toggle">
          {{ displayName }}
        </span>
        <ul v-show="showDropdown" class="dropdown-menu">
          <li
            v-for="item in menuItems"
            :key="item.name"
            class="dropdown-item"
          >
            <!-- 如果有 action，则用点击事件；否则用 RouterLink -->
            <span
              class="nav-link"
              @click="onMenuItemClick(item)"
            >
              {{ item.name }}
            </span>
<!--            <RouterLink-->
<!--              v-else-->
<!--              :to="item.path"-->
<!--              class="nav-link"-->
<!--              @click="onMenuItemClick(item)"-->
<!--            >-->
<!--              {{ item.name }}-->
<!--            </RouterLink>-->
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>


<style scoped>
.li-space{
  width: 8%;
}
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  background: var(--color-background);
}

.nav-list {
  display: flex;
  list-style: none;
  width: 100%;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin-left: 2rem;
}

.nav-link {
  text-decoration: none;
  color: var(--color-heading);
  cursor: pointer;
}



/* Dropdown */
.dropdown {
  margin-left: auto;
  position: relative;
  margin-right: 15%;
  width: 10%;
}

.dropdown-toggle::after {
  content: ' ▼';
  font-size: 0.7em;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--color-background-soft);
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
}

.dropdown-item {
  padding: 0.5rem 1rem;
}

.dropdown-item .nav-link:hover {
  //background: var(--color-border);
}
</style>
