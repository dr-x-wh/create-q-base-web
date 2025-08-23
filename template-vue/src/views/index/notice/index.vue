<script setup>
import {computed, onMounted, onUnmounted, reactive, ref, toRefs} from "vue"
import {useGetList} from "./api.js"

const loading = ref(false)
const tableRef = ref()
const isMobile = ref(false)

const data = reactive({
  query: {
    page: 1, per_page: 10,
    desc: null, order_by: null,
    title: null,
    release_date_0: null,
    release_date_1: null,
  },
  list: [],
  total: null,
})

const {query, list, total} = toRefs(data)

const release_date_range = computed({
  get() {
    return [query.value.release_date_0, query.value.release_date_1]
  },
  set(newVal) {
    if (newVal) {
      query.value.release_date_0 = newVal[0]
      query.value.release_date_1 = newVal[1]
    } else {
      query.value.release_date_0 = null
      query.value.release_date_1 = null
    }
  }
})


const handleResize = () => {
  const width = window.innerWidth
  isMobile.value = width < 768
}


const getList = async () => {
  try {
    loading.value = true
    const result = await useGetList(query.value)
    total.value = result.total
    list.value = result.data
  } catch (e) {
    console.warn(e)
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  query.value = {
    page: 1, per_page: 10,
    desc: null, order_by: null,
    title: null,
    release_date_0: null,
    release_date_1: null,
  }
  if (tableRef.value) tableRef.value.clearSort()
  getList()
}

const handleSort = ({order, prop}) => {
  if (order) {
    if (order === 'descending') query.value.desc = true
    else if (order === 'ascending') query.value.desc = false
    query.value.order_by = prop
  } else {
    query.value.desc = null
    query.value.order_by = null
  }
  getList()
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
  getList()
})


onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div v-loading="loading" style="padding: 30px; display: flex; flex-direction: column; gap: 20px;">
    <el-form size="small" :label-width="90">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="4">
          <el-form-item prop="title" label="通知标题">
            <el-input style="width: 100%" v-model="query.title"/>
          </el-form-item>
        </el-col>
        <template v-if="isMobile">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item prop="release_date_0" label="发布日期起始">
              <el-date-picker :editable="false" style="width: 100%;" type="date" value-format="YYYY-MM-DD"
                              v-model="query.release_date_0"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item prop="release_date_1" label="发布日期结束">
              <el-date-picker :editable="false" style="width: 100%;" type="date" value-format="YYYY-MM-DD"
                              v-model="query.release_date_1"/>
            </el-form-item>
          </el-col>
        </template>
        <template v-else>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item prop="start_date" label="发布日期">
              <el-date-picker :editable="false" style="width: 100%;" type="daterange" value-format="YYYY-MM-DD"
                              v-model="release_date_range"/>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item>
            <el-button type="primary" @click="getList">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table :size="isMobile?'small':'default'" style="width: 100%" ref="tableRef" @sort-change="handleSort"
              :row-key="row => row.id"
              :data="list">
      <el-table-column :width="60" align="center" label="序号" type="index"/>
      <el-table-column sortable="custom" prop="title" :min-width="200" label="通知标题"/>
      <el-table-column sortable="custom" align="center" prop="release_date" :width="200" label="发布日期"/>
      <el-table-column sortable="custom" align="center" prop="state" :width="200" label="通知状态">
        <template #default="{row}">
          <template v-if="row?.state === '1'">
            <div style="color: #67C23A">已通知</div>
          </template>
          <template v-else>
            <div style="color: #E6A23C">未通知</div>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :size="isMobile?'small':'default'" style="width: 100%;" layout="total, prev, pager, next, ->, sizes"
                   v-model:page-size="query.per_page"
                   v-model:current-page="query.page" :total="total"
                   @change="getList"/>
  </div>
</template>

<style scoped>
</style>
