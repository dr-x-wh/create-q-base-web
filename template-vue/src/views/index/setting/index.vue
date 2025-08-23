<script setup>
import {onMounted, ref} from "vue";
import {useGetInfo} from "@/api/user.js";
import {useUpdate} from "./api.js";
import {ElMessage} from "element-plus";

const loading = ref(false)
const formRef = ref()

const data = ref({
  remind_time: null,
  phone: null,
})

const rules = ref({
  phone: [
    {required: true, message: '请填写手机号码'},
  ],
})

const getData = async () => {
  try {
    loading.value = true
    const result = await useGetInfo()
    data.value.phone = result?.phone
    data.value.remind_time = result?.remind_time
  } catch (e) {
    console.warn(e)
  } finally {
    loading.value = false
  }
}

const handleSave = async () => {
  try {
    if (formRef.value) {
      const valid = await formRef.value.validate()
      if (valid) {
        loading.value = true
        await useUpdate(data.value)
        ElMessage.success("保存成功")
        await getData()
      }
    }
  } catch (e) {
    console.warn(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getData()
})
</script>

<template>
  <div v-loading="loading"
       style="padding: 30px; display: flex; flex-direction: column; gap: 20px; align-items: center;">
    <el-form ref="formRef" :rules="rules" :model="data" size="small" style="width: 300px;" :label-width="100">
      <el-form-item prop="remind_time" label="提醒时间">
        <div style="display: flex; gap: 5px;">
          <el-select placeholder="10" clearable v-model="data.remind_time" style="width: 80px;">
            <template v-for="num in Array.from({ length: 24 }, (_, index) => index)">
              <el-option :value="num" :label="num"/>
            </template>
          </el-select>
          <el-text>时</el-text>
        </div>
      </el-form-item>
      <el-form-item prop="phone" label="提醒电话">
        <el-input style="width: 100%;" :validate-event="false" v-model="data.phone"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleSave">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
</style>
