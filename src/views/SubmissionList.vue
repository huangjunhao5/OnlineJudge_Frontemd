<script setup lang="js">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/request/base.ts'
import {hasAdminPermission} from "@/lib/role.js";
import {getStatusTagType} from "@/lib/judge-result.ts";
import {ElMessage} from "element-plus";

const problemTitle = ref(new Map());

const route = useRoute()
const router = useRouter()

// 页码从路由参数或查询获取，默认 1
const page = ref(+route.params.page || +route.query.page || 1)
const pageSize = 10 // 固定每页条数
const total = ref(0)
const submissions = ref([])
const loading = ref(false)
const roles = ref([]);

const loadingList = ref([false, false, false, false, false, false, false, false, false, false])

const isAdmin = ref(false)

const fetchRoles = async () => {
  try {
    const res = await axios.get('/api/auth/roles');
    roles.value = res.data.roles;
    isAdmin.value = hasAdminPermission(roles)
  } catch (err) {
    // ElMessage.error('获取用户角色失败');
  }
};

// 拉取数据
async function fetchSubmissions() {
  loading.value = true
  try {
    const res = await axios.get('/api/evaluate/submissions', {
      params: { page: page.value, page_size: pageSize }
    })
    const payload = res.data.items
    console.log(res)
    submissions.value = payload.items || payload
    total.value = res.data.total
    for(let i = 0; i < res.data.items.length;i++){
      await fetchProblemTitle(res.data.items[i].problem_id)
    }
  } catch (e) {
    console.error('获取失败', e)
  } finally {
    loading.value = false
  }
}

async function fetchProblemTitle(problem_id) {
  const res = await axios.get(`/api/evaluate/problems/${problem_id}`)
  problemTitle.value.set(problem_id, res.data.title)
}

// 监听路由变化
watch(
  () => route.params.page || route.query.page,
  (val) => {
    const num = +val || 1
    if (num !== page.value) {
      page.value = num
      fetchSubmissions()
    }
  }
)

// 分页点击
function onPageChange(newPage) {
  // 使用 query 更通用
  router.replace({
    path: route.path,
    query: { ...route.query, page: newPage }
  })
}


async function rejudgeCode(submissionID, index) {
  loadingList[index] = true
  try {
    await axios.put('api/evaluate/submissions/' + submissionID + '/rejudge')
  } catch (err) {
    ElMessage.error("重测失败")
  } finally {
    loadingList[index] = false
  }
  await fetchSubmissions()
}

onMounted(() => {
  fetchRoles()
  fetchSubmissions()
})
</script>

<template>
  <div>
    <el-table
      :data="submissions"
      style="width: 100%"
      v-loading="loading"
    >
      <!-- ID Column -->
      <el-table-column
        prop="id"
        label="ID"
      >
        <template #default="{ row }">
          <router-link :to="`/submissions/${row.id}`" class="el-table-problem-list route-link">{{ row.id }}</router-link>
        </template>
      </el-table-column>

      <!-- Problem Column -->
      <el-table-column
        prop="problem_id"
        label="problem"
      >
        <template #default="{ row }">
          <router-link :to="`/problems/${row.problem_id}`" class="el-table-problem-list route-link">
            {{ problemTitle.get(row.problem_id) }}
          </router-link>
        </template>
      </el-table-column>
      <!-- user Column -->
      <el-table-column
        prop="user_id"
        label="user_id"
      >
        <template #default="{ row }">
          <div class="el-table-problem-list">{{ row.user_id }}</div>
        </template>
      </el-table-column>
      <!-- Language Column -->
      <el-table-column
        prop="language"
        label="language"
      >
        <template #default="{ row }">
          <div class="el-table-problem-list">{{ row.language }}</div>
        </template>
      </el-table-column>
      <!-- Status Column -->
      <el-table-column
        prop="status"
        label="status"
      >
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)" size="large">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column  v-if="isAdmin">
        <template #default="{ row , $index: index }">
          <el-button
            type="primary"
            :loading="loadingList[index]"
            @click="rejudgeCode(row.id, index)"> 重测 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div style="text-align: right; margin-top: 16px;">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        @current-change="onPageChange"
      />
    </div>
  </div>
</template>


<style scoped>
/* 可按需调整 */
.el-table-problem-list{
  color: var(--color-heading);
}

.route-link{
  text-decoration: underline;
}

</style>
