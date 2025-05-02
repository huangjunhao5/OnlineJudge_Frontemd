<template>
  <div class="problem-detail">
    <!-- Main Content -->
    <div class="content p-6">

      <el-card shadow="hover" class="mb-6">
        <h1 class="text-3xl font-bold mb-6">{{ problem.title }}</h1>
      </el-card>
      <!-- Description -->
      <el-card shadow="hover" class="mb-6">
        <h2 class="text-2xl font-medium mb-4">Description</h2>
        <div v-html="rendered.description" />
      </el-card>

      <!-- Input Description -->
      <el-card shadow="hover" class="mb-6">
        <h2 class="text-2xl font-medium mb-4">Input</h2>
        <div v-html="rendered.inputDesc" />
      </el-card>

      <!-- Output Description -->
      <el-card shadow="hover" class="mb-6">
        <h2 class="text-2xl font-medium mb-4">Output</h2>
        <div v-html="rendered.outputDesc" />
      </el-card>

      <!-- Samples -->
      <el-card v-if="problem.samples.length" shadow="hover" class="mb-6">
        <h2 class="text-2xl font-medium mb-4" style="padding-bottom: 0.5em;">Samples</h2>
        <el-row>
          <el-col
            v-for="(sample, index) in problem.samples"
            :key="sample.id"
            class="mb-4"
            :span="10"
            style="padding: 1em"
          >
            <el-card :gutter="16">
              <h3 class="text-2xl font-medium mb-4" style="padding-bottom: 1em;">样例{{index + 1}}</h3>
              <el-card>
                <div slot="header"><strong>Input</strong></div>
                <pre class="whitespace-pre-wrap font-mono">{{ sample.input }}</pre>
              </el-card>
              <el-card>
                <div slot="header"><strong>Output</strong></div>
                <pre class="whitespace-pre-wrap font-mono">{{ sample.output }}</pre>
              </el-card>
            </el-card>
          </el-col>
        </el-row>

      </el-card>

      <!-- Submission Box -->
      <el-card shadow="always" class="submission-box p-6 mb-6">
        <h2 class="text-2xl font-medium mb-4">Submit Your Code</h2>
        <el-form :model="submission" label-position="top" label-width="100px">
          <el-form-item label="Language">
            <el-select v-model="submission.language" placeholder="Select Language">
              <el-option label="C" value="c" />
              <el-option label="C++" value="cpp" />
              <el-option label="Java" value="java" />
              <el-option label="Python" value="python" />
            </el-select>
          </el-form-item>
          <el-form-item label="Code">
            <el-input
              type="textarea"
              v-model="submission.code"
              :rows="12"
              placeholder="Write your solution here..."
              class="font-mono"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" @click="submitCode">
              Submit
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- Fixed Sidebar -->
    <aside class="sidebar bg-white border-l p-6">
      <el-card shadow="never">
        <div class="mb-4 info">
          <h3 class="text-lg font-semibold">Problem Type</h3>
          <p>{{ problem.problem_type }}</p>
        </div>
        <div class="mb-4 info">
          <h3 class="text-lg font-semibold">Time Limit</h3>
          <p>{{ problem.time_limit }} s</p>
        </div>
        <div class="mb-4 info">
          <h3 class="text-lg font-semibold">Memory Limit</h3>
          <p>{{ problem.memory_limit }} MB</p>
        </div>
        <div v-if="problem.tags.length" class="info">
          <h3 class="text-lg font-semibold mb-2">Tags</h3>
          <el-tag
            v-for="tag in problem.tags"
            :key="tag.id"
            class="mr-2 mb-2"
            type="primary"
          >
            {{ tag.name }}
          </el-tag>
        </div>
      </el-card>
    </aside>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, nextTick} from 'vue';
import { useRoute } from 'vue-router';
import axios from '@/request/base.ts';
import MarkdownIt from 'markdown-it';
import markdownItMathjax from 'markdown-it-mathjax3';
import 'element-plus/dist/index.css';
import {ElMessage} from "element-plus";
import router from "@/router";

const route = useRoute();
const problem = ref({
  title: '',
  description: '',
  input_desc: '',
  output_desc: '',
  problem_type: '',
  time_limit: 0,
  memory_limit: 0,
  samples: [], tags: []
});
const rendered = ref({ description: '', inputDesc: '', outputDesc: '' });
const submission = ref({ code: '', language: 'cpp' });

interface UserSubmissions {
  code: string;
  problem_id: bigint;
  language: string;
}

// Markdown-It with MathJax
const md = new MarkdownIt().use(markdownItMathjax);

const fetchProblem = async () => {
  const { id } = route.params;
  try {
    const res = await axios.get(`/api/evaluate/problems/${id}`);
    console.log(res)
    problem.value = res.data;
    rendered.value.description = md.render(problem.value.description);
    rendered.value.inputDesc = md.render(problem.value.input_desc);
    rendered.value.outputDesc = md.render(problem.value.output_desc);
    // 等待 v-html 将内容写入 DOM
    await nextTick(() => {
      if (window.MathJax && window.MathJax.typeset) {
        window.MathJax.typeset();
      }
    });
  } catch (err) {
    console.error('Failed to load problem:', err);
  }
};

const submitCode = async () => {
  try {
    const { id } = route.params;
    const userSubmission = {
      code: submission.value.code,
      problem_id: id,
      language: submission.value.language,
    }
    const res = await axios.post(
      `/api/evaluate/submissions`,
      userSubmission,);
    ElMessage.success('提交成功');
    console.log(res.data)
    await router.push(`/submissions/${res.data.submission_id}`)
  } catch (err) {
    console.error('Submission failed:', err);
    ElMessage.error('Submission failed.');
  }
};

onMounted(fetchProblem);
</script>

<style scoped>
.problem-detail {
  display: flex;
}

.info {
  padding-bottom: 1em;
}

.content {
  //flex: 1;
  //margin-right: 20rem; /* Reserve space for sidebar */
  width: 90%;
}

.sidebar {
  position: fixed;
  top: 6rem;
  right: 1rem;
  width: 18rem;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  z-index: 10;
}

.font-mono {
  font-family: 'Fira Code', monospace;
}
@media screen and (max-aspect-ratio: 1/1.4) {
  .sidebar { display: none; }
}
</style>
