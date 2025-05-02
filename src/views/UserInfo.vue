<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>用户详情</span>
    </div>

    <el-descriptions title="基本信息" :column="1" class="base-info" size="large">
      <el-descriptions-item label="ID">{{ user.id }}</el-descriptions-item>
      <el-descriptions-item label="用户名">{{ user.username }}</el-descriptions-item>
      <el-descriptions-item label="邮箱">{{ user.email }}</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ formatDate(user.created_at) }}</el-descriptions-item>
      <el-descriptions-item label="更新时间">{{ formatDate(user.updated_at) }}</el-descriptions-item>
    </el-descriptions>

    <el-descriptions title="角色信息" :column="1" style="margin-top: 20px;">
      <el-descriptions-item label="角色列表">
        <el-tag
          v-for="role in roles"
          :key="role.id"
          style="margin-right: 8px;"
        >
          {{ role.Name }}
        </el-tag>
      </el-descriptions-item>
    </el-descriptions>
    <!-- 权限按钮区域 -->
    <div class="actions">
      <el-button
        v-if="isAdmin"
        type="primary"
        @click="openNewQuestion"
      >增加新题目</el-button>
      <el-button
        v-if="isRoot"
        type="success"
        @click="openUserManagement"
      >用户管理</el-button>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/request/base.ts';
import { ElMessage } from 'element-plus';
import {getCookie} from "@/lib/cookie.js";
import {extractPayload} from "@/lib/user-lib.js";
import {hasAdminPermission, hasRootPermission} from "@/lib/role.js";

const isAdmin = ref(false); // hasAdminPermission(roles)
const isRoot = ref(false);  // hasRootPermission(roles)
const user = ref({});
const roles = ref([]);


const openNewQuestion = () => window.open('/question/new', '_blank');
const openUserManagement = () => {} //  window.open('/users/manage', '_blank');

const formatDate = iso => new Date(iso).toLocaleString();


// 从 Cookie 中获取 token

// 解析 JWT Payload 部分，无类型转换，保持 userId 原始字符串


const token = getCookie('token');
const rawPayload = token ? extractPayload(token) : null;
// 使用正则从原始字符串中精准提取数字 userId
let userId = null;
if (rawPayload) {
  const match = rawPayload.match(/"UserID"\s*:\s*"?(\d+)"?/);
  userId = match ? match[1] : null;
}

const fetchUser = async () => {
  if (!userId) {
    ElMessage.error('无法获取用户 ID');
    return;
  }
  try {
    const res = await axios.get(`/api/users/me`);
    user.value = res.data;
  } catch (err) {
    ElMessage.error('获取用户信息失败' + err.response?.msg);
  }
};


const fetchRoles = async () => {
  try {
    const res = await axios.get('/api/auth/roles');
    console.log(res.data)
    roles.value = res.data.roles;
    isAdmin.value = hasAdminPermission(roles)
    isRoot.value = hasRootPermission(roles)
    console.log(isAdmin)
  } catch (err) {
    console.log(err)
    ElMessage.error('获取用户角色失败');
  }
};


onMounted(() => {
  fetchUser();
  fetchRoles();
});
</script>

<style scoped>
.box-card {
  width: 50%;
  margin: 2em auto;
  font-size: 36px;
}

.float-right {
  float: right;
}
.header h2 {
  margin: 0 0 16px;
}
.actions {
  text-align: right;
  margin-top: 16px;
}
</style>
