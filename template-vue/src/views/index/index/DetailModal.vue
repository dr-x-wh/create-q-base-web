<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {useCreate, useGetDetail, useUpdate} from "./api.js";
import {ElMessage} from "element-plus";

const loading = ref(false)
const visible = ref(false)
const type = ref(null)
const modalRef = ref()
const formRef = ref()
let resolveRef

const title = computed(() => {
  if (type.value === 'add') return '添加'
  else if (type.value === 'update') return '修改'
  else return '未知'
})

const data = ref({
  name: null,
  person: null,
  phone: null,
  start_date: null,
  end_date: null,
})

const date_range = computed({
  get() {
    return [data.value.start_date, data.value.end_date]
  },
  set(newVal) {
    if (newVal) {
      data.value.start_date = newVal[0]
      data.value.end_date = newVal[1]
    } else {
      data.value.start_date = null
      data.value.end_date = null
    }
  }
})

const rules = ref({
  name: [
    {required: true, message: '请输入提醒任务名称', trigger: 'blur'},
  ],
  start_date: [
    {required: true, message: '请选择起止日期', trigger: 'change'},
  ],
  end_date: [
    {required: true, message: '请选择起止日期', trigger: 'change'},
  ],
})

const dialogWidth = ref('60%')
const isMobile = ref(false)

const handleResize = () => {
  const width = window.innerWidth
  isMobile.value = width < 768
  dialogWidth.value = isMobile.value ? '90%' : '60%'
}

const open = (typeVal, idVal) => {
  return new Promise((resolve) => {
    resolveRef = resolve
    if (typeVal === 'update') getData(idVal)
    type.value = typeVal
    visible.value = true
  })
}

const close = () => {
  data.value = {
    name: null,
    person: null,
    phone: null,
    start_date: null,
    end_date: null,
  }
  if (formRef.value) formRef.value.clearValidate()
}

const getData = async (info_id) => {
  try {
    loading.value = true
    data.value = await useGetDetail(info_id)
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
        if (type.value === 'add') await useCreate(data.value)
        else if (type.value === 'update') await useUpdate(data.value)
        ElMessage.success("保存成功")
        if (modalRef.value) modalRef.value.handleClose()
        resolveRef()
      }
    }
  } catch (e) {
    console.warn(e)
  }

}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

defineExpose({
  open,
})
</script>

<template>
  <el-dialog ref="modalRef" v-model="visible" :width="dialogWidth" @closed="close">
    <template #header>
      <el-text size="large">{{ title }}</el-text>
    </template>
    <div v-loading="loading" style="padding: 0 20px;">
      <el-form :size="isMobile?'small':'default'" :label-position="isMobile?'top':'left'" ref="formRef" :rules="rules"
               :model="data" :label-width="110">
        <el-divider/>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item prop="name" label="提醒任务名称">
              <el-input style="width: 100%;" :validate-event="false" v-model="data.name"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider/>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item prop="person" label="联系人">
              <el-input style="width: 100%;" :validate-event="false" v-model="data.person"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item prop="phone" label="联系电话">
              <el-input style="width: 100%;" :validate-event="false" v-model="data.phone"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider/>
        <el-row :gutter="10">
          <template v-if="isMobile">
            <el-col :xs="24" :sm="12" :md="12">
              <el-form-item prop="start_date" label="开始日期">
                <el-date-picker :editable="false" :validate-event="false" style="width: 100%;" type="date"
                                value-format="YYYY-MM-DD"
                                v-model="data.start_date"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12">
              <el-form-item prop="end_date" label="结束日期">
                <el-date-picker :editable="false" :validate-event="false" style="width: 100%;" type="date"
                                value-format="YYYY-MM-DD"
                                v-model="data.end_date"/>
              </el-form-item>
            </el-col>
          </template>
          <template v-else>
            <el-col :xs="24" :sm="12" :md="12">
              <el-form-item prop="start_date" label="起止日期">
                <el-date-picker :editable="false" :validate-event="false" style="width: 100%;" type="daterange"
                                value-format="YYYY-MM-DD"
                                v-model="date_range"/>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="handleSave" type="primary">保存</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
</style>
