<script setup>
import {onMounted, onUnmounted, reactive, ref, toRefs} from "vue"
import {useGetList, useUpdate} from "./api.js"
import {ElMessageBox} from "element-plus";

const loading = ref(false)
const tableRef = ref()
const isMobile = ref(false)

const data = reactive({
  query: {
    page: 1, per_page: 10,
    desc: null, order_by: null,
    name: null,
    key: null,
    value: null,
    update_by: null,
    update_time: null,
  },
  list: [],
  total: null,
})

const {query, list, total} = toRefs(data)


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
    name: null,
    key: null,
    value: null,
    update_by: null,
    update_time: null,
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

const handleUpdate = async (id) => {
  try {
    const {value} = await ElMessageBox.prompt("输入设置值", "设置", {
      inputPattern: /\d+/,
    })
    await useUpdate({id, value})
    await getList()
  } catch (e) {
    console.warn(e)
  }
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
          <el-form-item prop="name" label="设置名称">
            <el-input style="width: 100%" v-model="query.name"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="4">
          <el-form-item prop="key" label="设置代码">
            <el-input style="width: 100%" v-model="query.key"/>
          </el-form-item>
        </el-col>
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
      <el-table-column sortable="custom" prop="name" :width="200" label="设置名称"/>
      <el-table-column sortable="custom" prop="key" :width="200" label="设置代码"/>
      <el-table-column prop="value" :min-width="200" label="设置值"/>
      <el-table-column sortable="custom" prop="update_by" :width="200" label="最近更改人"/>
      <el-table-column sortable="custom" align="center" prop="update_time" :width="200" label="最近更改时间"/>
      <el-table-column fixed="right" align="center" :width="60" label="操作">
        <template #default="{row}">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">
            <el-button type="warning" link @click="() => handleUpdate(row?.id)">修改</el-button>
          </div>
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
