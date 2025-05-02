<template>
  <div class="problem-detail">
    <div class="content p-6">
      <ProblemForm
        mode="edit"
        :initialData="form"
        @submit="updateProblem"
      />
    </div>
    <aside class="sidebar bg-white border-l p-6">
      <el-card shadow="never">
        <div class="mb-4"><h3 class="text-lg font-semibold">Mode</h3><p>Editing</p></div>
        <div style="height: 0.5em"></div>
        <div class="mb-4"><h3 class="text-lg font-semibold">Problem ID</h3><p>{{ form.id }}</p></div>
        <div style="height: 1em"></div>
<!--        <el-button v-if="form.id" type="primary" @click="triggerUpload">提交测试数据</el-button>-->
<!--        <input ref="fileInput" type="file" accept=".zip" style="display:none" @change="uploadTestcases" />-->
        <div class="mb-4"><h3 class="text-lg font-semibold">测试数据</h3></div>
        <div style="height: 1em"></div>
        <el-upload
          class="upload-demo"
          :http-request="uploadTestcases as any"
          :file-list="testcaseFiles"
          :auto-upload="true"
          :limit="1"
          accept=".zip"
          list-type="text"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :on-progress="handleProgress"
          @click="cleanTestcase"
          drag
        >
        <el-button type="primary">选择 ZIP 文件</el-button>
          <div class="el-upload__tip" slot="tip">
            只能上传 zip 文件
          </div>
        </el-upload>
        <el-progress
          v-if="uploadProgress > 0"
          :percentage="uploadProgress"
          class="mt-4"
        />
      </el-card>
    </aside>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/request/base.ts';
import ProblemForm from '@/components/ProblemForm.vue';
import { ElMessage } from 'element-plus';
import type { UploadUserFile, UploadRequestOptions } from 'element-plus'

const route = useRoute();
const router = useRouter();
const form = ref<any>({
  id: null,
  title: '',
  description: '',
  input_desc: '',
  output_desc: '',
  problem_type: '',
  time_limit: 1,
  memory_limit: 128,
  tags: [],
  samples: []
});

const id = route.params.id as string;

const testcaseFiles = ref<UploadUserFile[]>([])

// 获取题目信息，并根据后端返回的 problem.tags 填充 form
const fetchProblem = async () => {
  try {
    const res = await axios.get(`/api/evaluate/problems/${id}`);
    const data = res.data;
    form.value = {
      ...data,
    };
    console.log(form.value)
  } catch (err) {
    console.error('Failed to load problem:', err);
  }
};

// 更新题目信息
const updateProblem = async (payload: any) => {
  try {
    payload.id = form.value.id;
    const samples = []
    for(let i = 0;i < payload.samples.length;i++){
      let id_temp = "0"
      if (payload.samples[i].id) id_temp = payload.samples[i].id
      samples.push({
        id: id_temp,
        input: payload.samples[i].input,
        output: payload.samples[i].output,
      })
    }
    const tags = []
    for(let i = 0;i < payload.tags.length;i++){
      let id_temp = "0"
      if (payload.tags[i].id) id_temp = payload.tags[i].id
      tags.push({
        id: id_temp,
        name: payload.tags[i].name,
      })
    }
    const data = {
      id: payload.id,
      title: payload.title,
      description: payload.description,
      input_desc: payload.input_desc,
      output_desc: payload.output_desc,
      problem_type: payload.problem_type,
      time_limit: payload.time_limit,
      memory_limit: payload.memory_limit,
      tags: tags,
      samples: samples,
      testcase_num: form.value.testcase_num
    }
    console.log(data)
    await axios.put(`/api/evaluate/problems/${id}`, data);
    ElMessage.success('Problem updated');
    await router.push('/problems');
  } catch (err) {
    console.error('Update failed', err);
    const msg = err.response?.data.msg
    let message = '更新失败'
    if (msg) {
      message = message + ":" + msg
    }
    ElMessage.error(message);
  }
};

function cleanTestcase(){
  testcaseFiles.value = []
}

const handleChange = (file: UploadUserFile, fileList: UploadUserFile[]) => {
  testcaseFiles.value = fileList
}

const handleRemove = (file: UploadUserFile, fileList: UploadUserFile[]) => {
  testcaseFiles.value = fileList
}

const uploadTestcases = async (options: UploadRequestOptions) => {
  const file = options.file as File
  const formData = new FormData()
  formData.append('file', file)
  try {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    await axios.post(
      `/api/evaluate/problems/${form.value.id}/testcases`,
      formData,
      config
    )
    ElMessage.success('测试数据上传成功')
    // testcaseFiles.value = []
  } catch (err) {
    const msg = err.response?.data.msg
    let message = '上传失败'
    if (msg) {
      message = message + ":" + msg
    }
    ElMessage.error(message)
  }
}

const uploadProgress = ref(0)

// 上传进度处理
const handleProgress = (event: ProgressEvent) => {
  if (event.lengthComputable) {
    uploadProgress.value = Math.round((event.loaded / event.total) * 100)
  }
}


onMounted(fetchProblem);
</script>

<style scoped>
.problem-detail { display: flex; }
.content { width: 90%; }
.sidebar {
  position: fixed;
  top: 6rem;
  right: 1rem;
  width: 18rem;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  z-index: 10;
}
.font-mono { font-family: 'Fira Code', monospace; }
@media screen and (max-aspect-ratio: 1/1.4) { .sidebar { display: none; } }
</style>
