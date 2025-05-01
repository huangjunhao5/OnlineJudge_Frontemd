<template>
  <el-card class="main-card" shadow="hover">
    <template #header>
      <span>提交详情 - ID: {{ submission.id }}</span>
    </template>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="题目 ID">{{ submission.problem_id }}</el-descriptions-item>
      <el-descriptions-item label="用户 ID">{{ submission.user_id }}</el-descriptions-item>
      <el-descriptions-item label="语言">{{ submission.language }}</el-descriptions-item>
      <el-descriptions-item label="状态">

        <el-tag :type="getStatusTagType(submission.status)">
          {{ submission.status }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="运行时间">{{ submission.run_time }} ms</el-descriptions-item>
      <el-descriptions-item label="内存占用">{{ submission.memory_usage }} MB</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ submission.created_at }}</el-descriptions-item>
    </el-descriptions>
  </el-card>

  <el-card class="code-card" shadow="always" v-if="submission.info">
    <template #header><span>编译信息</span></template>
    <vue-code-block :code="submission.info" language="shell-session" :prismjs="Prism"/>
  </el-card>

  <el-card class="code-card" shadow="always">
    <template #header><span>用户代码</span></template>
    <vue-code-block :code="submission.code" :language="submission.language" :prismjs="Prism"/>
  </el-card>

  <el-button
    v-if="submission.status !== 'Accepted' && submission.status !== 'pending'"
    type="primary"
    @click="askGPT"
    :loading="isAsking"
    style="margin-top: 16px;"
  >
    向 GPT 询问答案
  </el-button>

  <el-card v-if="gptAnswer" class="gpt-card" shadow="always" style="margin-top: 16px;">
    <template #header><span>GPT 解答</span></template>
    <markdown :source="gptAnswer" />
  </el-card>
  <div class="space"/>
</template>

<script setup>
import Prism from 'prismjs';
// 根据需要手动引入语言（如果没有全量包）
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-c.js';
import 'prismjs/components/prism-cpp.js';
import 'prismjs/components/prism-java.js';
import 'prismjs/components/prism-python.js';
import 'prismjs/components/prism-shell-session.js'

import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/request/base.js';
import VueCodeBlock from '@wdns/vue-code-block';
import Markdown from 'vue3-markdown-it';
import {ElMessage} from "element-plus";
import {getStatusTagType} from "@/lib/judge-result.js";

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const submission = ref({
  id: 0, problem_id: 0, user_id: 0, language: '', code: '',
  status: '', run_time: 0, memory_usage: 0, created_at: '', info: ''
});

const gptAnswer = ref('');
const isAsking = ref(false);

async function fetchSubmission() {
  try {
    const { data } = await axios.get(`/api/evaluate/submissions/${id}`);
    submission.value = data;
  } catch (err) {
    ElMessage.error('你没有权限查看此提交记录');
    router.back();
  }
}

function pollIfPending() {
  if (submission.value.status === 'Pending') {
    setTimeout(async () => {
      await fetchSubmission();
      pollIfPending();
    }, 2000);
  }
}

async function askGPT() {
  isAsking.value = true
  gptAnswer.value = ''
  try {
    const { data } = await axios.get(`/api/chat/ask/${id}`);
    gptAnswer.value = data;
  } catch (err) {
    ElMessage.error('GPT 询问失败');
  } finally {
    isAsking.value = false;
  }
}

onMounted(async () => {
  await fetchSubmission();
  pollIfPending();
});
</script>

<style scoped>
.main-card { margin-bottom: 16px; }
.code-card { margin-top: 16px; font-family: 'Fira Code', monospace; }
.gpt-card {
  margin-top: 16px;
}
.space{
  height: 5em;
}
</style>
