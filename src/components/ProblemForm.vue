// src/components/ProblemForm.vue
<template>
  <el-card shadow="hover" class="mb-6">
    <h1 class="text-3xl font-bold mb-6">
      {{ mode === 'edit' ? 'Edit Problem' : 'Create New Problem' }}
    </h1>
    <el-form :model="form" ref="formRef" label-position="top" label-width="120px">
      <el-form-item label="Title" prop="title" :rules="[{ required: true, message: 'Title is required' }]">
        <el-input v-model="form.title" placeholder="Enter problem title" />
      </el-form-item>
      <el-form-item label="Description" prop="description" :rules="[{ required: true, message: 'Description is required' }]">
        <el-input type="textarea" v-model="form.description" :rows="6" placeholder="Markdown supported" />
      </el-form-item>
      <el-form-item label="Input Description" prop="input_desc" :rules="[{ required: true, message: 'Input description is required' }]">
        <el-input type="textarea" v-model="form.input_desc" :rows="4" placeholder="Markdown supported" />
      </el-form-item>
      <el-form-item label="Output Description" prop="output_desc" :rules="[{ required: true, message: 'Output description is required' }]">
        <el-input type="textarea" v-model="form.output_desc" :rows="4" placeholder="Markdown supported" />
      </el-form-item>
      <el-form-item label="Problem Type" prop="problem_type" :rules="[{ required: true, message: 'Type is required' }]">
        <el-select v-model="form.problem_type" placeholder="Select type">
          <el-option label="std" value="std" />
<!--          <el-option label="Data Structure" value="data_structure" />-->
<!--          <el-option label="Math" value="math" />-->
        </el-select>
      </el-form-item>
      <el-form-item label="Time Limit (s)" prop="time_limit" :rules="[{ required: true, message: 'Time limit is required' }]">
        <el-input-number v-model="form.time_limit" :min="1" />
      </el-form-item>
      <el-form-item label="Memory Limit (MB)" prop="memory_limit" :rules="[{ required: true, message: 'Memory limit is required' }]">
        <el-input-number v-model="form.memory_limit" :min="1" />
      </el-form-item>

      <!-- Tag Input -->
      <el-form-item label="Tags">
        <el-input
          v-model="newTag"
          placeholder="Type tag and press Enter"
          @keyup.enter.native.prevent="addTag"
        />
        <div class="mt-2 flex flex-wrap">
          <el-tag
            v-for="(tag, index) in form.tags"
            :key="tag"
            closable
            @close="removeTag(index)"
            class="mr-2 mb-2"
          >
            {{ tag.name }}
          </el-tag>
        </div>
      </el-form-item>
      <el-form-item label="Samples">
        <el-row style="width: 100%">
          <el-col
            v-for="(s, idx) in form.samples" :key="idx" class="mb-4"
            :span="8"
            style="padding-bottom: 1em;padding-right: 1em;">
            <el-card>
              <el-row :gutter="16">
                <div slot="header"><strong>Input</strong></div>
                <el-input
                  type="textarea"
                  v-model="s.input"
                  :rows="3"
                  placeholder="Sample input"
                  label="Input"
                />
              </el-row>
              <el-row :gutter="16">
                <div slot="header"><strong>Output</strong></div>
                <el-input
                  type="textarea"
                  v-model="s.output"
                  :rows="3"
                  placeholder="Sample output"
                  label="Output"
                />
              </el-row>
              <el-row style="padding-top: 0.5em;">
                <el-col :span="2" class="flex items-center">
                  <el-button type="danger" @click="removeSample(idx)">删除样例</el-button>
                </el-col>
              </el-row>
            </el-card>
          </el-col>

        </el-row>
        <div style="padding-top: 0.5em;width: 100%;"/>
        <el-row>
          <el-button type="primary" plain @click="addSample">添加样例</el-button>
        </el-row>

      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="large" @click="submitForm">
          {{ mode === 'edit' ? 'Update Problem' : 'Create Problem' }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import {defineProps, defineEmits, ref, watch} from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance } from 'element-plus';

interface FormData {
  id?: number | string;
  title: string;
  description: string;
  input_desc: string;
  output_desc: string;
  problem_type: string;
  time_limit: number;
  memory_limit: number;
  tags: {name: string}[];
  samples: { input: string; output: string }[];
}

const props = defineProps<{
  mode: 'create' | 'edit';
  initialData?: Partial<FormData>;
}>();
const emit = defineEmits<{
  (e: 'submit', payload: FormData): void;
}>();

// 默认字段
const defaultData: FormData = {
  title: '',
  description: '',
  input_desc: '',
  output_desc: '',
  problem_type: '',
  time_limit: 1,
  memory_limit: 128,
  tags: [],
  samples: [],
};

// 合并 initialData
const form = ref<FormData>({ ...defaultData, ...(props.initialData || {}) });
const newTag = ref('');
const formRef = ref<FormInstance>();

const addTag = () => {
  const tag = newTag.value.trim();
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push({name: tag});
  }
  newTag.value = '';
};

const removeTag = (index: number) => {
  form.value.tags.splice(index, 1);
};

// 3. 监听 initialData，更新表单
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      Object.assign(form.value, defaultData, newData);
      form.value.samples = newData.samples ? [...newData.samples] : [];
    }
  },
  { deep: true, immediate: true }
);

const submitForm = () => {
  const f = formRef.value;
  if (!f) {
    ElMessage.error('表单未初始化，无法提交');
    return;
  }

  // 调用 validate 方法校验表单
  f.validate((valid: boolean, fields: Record<string, any>) => {
    if (valid) {
      // 验证通过，向父组件派发 submit 事件
      emit('submit', { ...form.value });
    } else {
      // 验证失败，滚动到第一个错误字段并提示
      f.scrollToField(Object.keys(fields)[0]);
      ElMessage.error('请完善表单中的必填项后再提交');
    }
  });
};
const addSample = () => {
  form.value.samples.push({ input: '', output: '' });
};
const removeSample = (index: number) => {
  form.value.samples.splice(index, 1);
};

</script>

<style scoped>
.mb-6 { margin-bottom: 1.5rem; }
.flex { display: flex; }
.items-center { align-items: center; }
.mr-2 { margin-right: 0.5rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mt-2 { margin-top: 0.5rem; }
</style>
