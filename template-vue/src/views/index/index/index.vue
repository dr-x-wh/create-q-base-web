<script setup>
import request from "@/utils/request.js";

const handleClick = async () => {
  try {
    const result = await request.post('/user', null, {params: {id: 123}})
    console.log(result)
  } catch (e) {
    console.warn(e)
  }
}
</script>

<template>
  <div>
    <el-button @click="handleClick">发送请求</el-button>
  </div>
</template>

<style scoped>
</style>
