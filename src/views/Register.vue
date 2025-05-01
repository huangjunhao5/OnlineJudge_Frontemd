<template>
  <el-card class="register-card" shadow="hover">
    <h2 class="text-center mb-4">注册</h2>
    <el-form :model="regForm" :rules="regRules" ref="regRef" label-position="top">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="regForm.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="regForm.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="regForm.password" type="password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="regForm.confirmPassword" type="password" placeholder="请再次输入密码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onRegister" :loading="loading">注册</el-button>
        <router-link to="/login" class="el-button el-button--text ml-2">去登录</router-link>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/request/base.ts'
import {ElMessage} from "element-plus";
import {saveLoginState} from "@/lib/user-lib.js";

const router = useRouter()
const regRef = ref(null)
const loading = ref(false)

const regForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const regRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== regForm.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change']
    }
  ]
}

const onRegister = () => {
  regRef.value.validate(async valid => {
    if (!valid) return
    loading.value = true
    try {
      const { username, email, password } = regForm
      const response = await axios.post('/api/users/register', { username, email, password })
      // 1. 读取 token
      const token = response.data.token
      saveLoginState(token, username)
      ElMessage.success('注册成功')
      await router.push('/')
    } catch (err) {
      console.log(err.response)
      ElMessage.error(err.response?.data.msg ?? "")
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.register-card {
  width: 35%;
  min-width: 18em;
  margin: 5% 15%;
  padding: 2%;
  position: fixed;
}
</style>
