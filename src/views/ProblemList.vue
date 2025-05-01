<template>
  <div>
    <el-table
      :data="problems"
      style="width: 100%"
      v-loading="loading"
    >
      <!-- ID Column -->
      <el-table-column
        prop="id"
        label="ID"
      >
        <template #default="{ row }">
          <router-link :to="`/problems/${row.id}`" class="el-table-problem-list">{{ row.id }}</router-link>
        </template>
      </el-table-column>

      <!-- Title Column -->
      <el-table-column
        prop="title"
        label="Title"
      >
        <template #default="{ row }">
          <router-link :to="`/problems/${row.id}`" class="el-table-problem-list">{{ row.title }}</router-link>
        </template>
      </el-table-column>

      <!-- Tags Column -->
      <el-table-column
        prop="tags"
        label="Tags"
      >
        <template #default="{ row }">
          <el-tag
            v-for="tag in row.tags"
            :key="tag"
            type="info"
            size="large"
            style="margin-right: 4px;"
          >
            {{ tag }}
          </el-tag>
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

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/request/base.ts'

const route = useRoute()
const router = useRouter()

// 页码从路由参数或查询获取，默认 1
const page = ref(+route.params.page || +route.query.page || 1)
const pageSize = 10 // 固定每页条数
const total = ref(0)
const problems = ref([])
const loading = ref(false)

// 拉取数据
async function fetchProblems() {
  loading.value = true
  try {
    const res = await axios.get('/api/evaluate/problems', {
      params: { page: page.value, page_size: pageSize }
    })
    const payload = res.data.items
    console.log(res)
    problems.value = payload.items || payload
    total.value = res.data.total
  } catch (e) {
    console.error('获取失败', e)
  } finally {
    loading.value = false
  }
}

// 监听路由变化
watch(
  () => route.params.page || route.query.page,
  (val) => {
    const num = +val || 1
    if (num !== page.value) {
      page.value = num
      fetchProblems()
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

onMounted(fetchProblems)
</script>

<style scoped>
/* 可按需调整 */
.el-table-problem-list{
  color: var(--color-heading);
}
</style>
