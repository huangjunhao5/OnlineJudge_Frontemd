<template>
  <el-card class="box-card" header="分配权限">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="用户ID" prop="user_id">
        <el-input
          v-model="form.user_id"
          placeholder="请输入用户ID"
          style="width: 100%;"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确认</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import axios from '@/request/base.js'

const formRef = ref()
const form = reactive({
  user_id: null
})

const rules = {
  user_id: [
    { required: true, message: '请输入用户ID', trigger: 'blur' }
  ]
}

const onSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await axios.post('/api/auth/roles', {
          user_id: form.user_id,
          role_id: "2"
        })
        ElMessage.success('角色分配成功')
        form.user_id = null
      } catch (error) {
        ElMessage.error('请求失败，请检查网络或服务器')
      }
    }
  })
}
</script>

<style scoped>
.box-card {
  max-width: 500px;
  margin: 40px auto;
}
</style>
