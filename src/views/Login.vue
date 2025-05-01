<template>
  <el-card class="login-card" shadow="hover">
    <h2 class="text-center mb-4">登录</h2>
    <el-form :model="loginForm" :rules="loginRules" ref="loginRef" label-position="top">
      <el-form-item label="用户名或邮箱" prop="username">
        <el-input v-model="loginForm.username" placeholder="请输入用户名或邮箱" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onLogin" :loading="loading">登录</el-button>
        <router-link to="/register" class="el-button el-button--text ml-2">注册</router-link>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/request/base.ts'
import {ElMessage, type FormInstance} from "element-plus";
import {saveLoginState} from '@/lib/user-lib.ts'

const router = useRouter()
const loginRef = ref<FormInstance>();
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const loginRules = {
  username: [{ required: true, message: '请输入用户名或邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

// 告诉 TS：loginRef 会是一个 FormInstance

const onLogin = () => {
  loginRef.value?.validate(async valid => {
    if (!valid) return
    loading.value = true
    try {
      const response = await axios.post('/api/users/login', loginForm)
      // 1. 读取 token
      const token = response.data.token
      const username = response.data.username

      saveLoginState(token, username)
      // 跳转到首页
      await router.push('/')
      ElMessage.success("登录成功")
    } catch (err) {
      ElMessage.error('登录失败，用户名或密码错误')
      // 可使用 Element Plus 通知或提示组件
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.login-card {
  width: 35%;
  min-width: 18em;
  margin: 5% 15%;
  padding: 2%;
  position: fixed;
}
</style>

