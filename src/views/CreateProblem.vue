<template>
  <div class="problem-detail">
    <div class="content p-6">
      <ProblemForm
        mode="create"
        :initialData="{}"
        @submit="createProblem"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import axios from '@/request/base.ts';
import ProblemForm from '@/components/ProblemForm.vue';
import { ElMessage } from 'element-plus';

const router = useRouter();

const createProblem = async (payload: any) => {
  try {
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
      testcase_num: 0
    }
    await axios.post('/api/evaluate/problems', data);
    ElMessage.success('Problem created');
    await router.push('/problems');
  } catch (err) {
    console.error(err);
    ElMessage.error('Failed to create problem');
  }
};
</script>
