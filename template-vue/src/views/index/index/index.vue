<script setup>
import {computed, onMounted, onUnmounted, reactive, ref, toRefs} from "vue"
import {useDelete, useGetList} from "./api.js"
import DetailModal from "./DetailModal.vue";
import {ElMessage, ElMessageBox} from "element-plus";

const loading = ref(false)
const detailRef = ref()
const tableRef = ref()
const isMobile = ref(false)

const data = reactive({
  query: {
    page: 1, per_page: 10,
    desc: null, order_by: null,
    name: null,
    person: null,
    phone: null,
    start_date_0: null,
    start_date_1: null,
    end_date_0: null,
    end_date_1: null,
  },
  list: [],
  total: null,
})

const {query, list, total} = toRefs(data)

const start_date_range = computed({
  get() {
    return [query.value.start_date_0, query.value.start_date_1]
  },
  set(newVal) {
    if (newVal) {
      query.value.start_date_0 = newVal[0]
      query.value.start_date_1 = newVal[1]
    } else {
      query.value.start_date_0 = null
      query.value.start_date_1 = null
    }
  }
})
const end_date_range = computed({
  get() {
    return [query.value.end_date_0, query.value.end_date_1]
  },
  set(newVal) {
    if (newVal) {
      query.value.end_date_0 = newVal[0]
      query.value.end_date_0 = newVal[1]
    } else {
      query.value.end_date_0 = null
      query.value.end_date_0 = null
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
    name: null,
    person: null,
    phone: null,
    start_date_0: null,
    start_date_1: null,
    end_date_0: null,
    end_date_1: null,
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

const handleDetail = (type, id) => {
  if (detailRef.value) {
    detailRef.value.open(type, id).then(() => getList())
  }
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm("确认删除？", "删除")
    loading.value = true
    await useDelete(id)
    ElMessage.success("删除成功")
    await getList()
  } catch (e) {
    console.warn(e)
  } finally {
    loading.value = false
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
          <el-form-item prop="name" label="提醒任务名称">
            <el-input style="width: 100%" v-model="query.name"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="4">
          <el-form-item prop="person" label="联系人">
            <el-input style="width: 100%" v-model="query.person"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="4">
          <el-form-item prop="phone" label="联系电话">
            <el-input style="width: 100%" v-model="query.phone"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <template v-if="isMobile">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item prop="start_date_0" label="开始日期起始">
              <el-date-picker :editable="false" style="width: 100%;" type="date" value-format="YYYY-MM-DD"
                              v-model="query.start_date_0"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item prop="start_date_1" label="开始日期结束">
              <el-date-picker :editable="false" style="width: 100%;" type="date" value-format="YYYY-MM-DD"
                              v-model="query.start_date_1"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item prop="end_date_0" label="到期日期起始">
              <el-date-picker :editable="false" style="width: 100%;" type="date" value-format="YYYY-MM-DD"
                              v-model="query.end_date_0"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item prop="end_date_1" label="到期日期结束">
              <el-date-picker :editable="false" style="width: 100%;" type="date" value-format="YYYY-MM-DD"
                              v-model="query.end_date_1"/>
            </el-form-item>
          </el-col>
        </template>
        <template v-else>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item prop="start_date" label="开始日期">
              <el-date-picker :editable="false" style="width: 100%;" type="daterange" value-format="YYYY-MM-DD"
                              v-model="start_date_range"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item prop="end_date" label="到期日期">
              <el-date-picker :editable="false" style="width: 100%;" type="daterange" value-format="YYYY-MM-DD"
                              v-model="end_date_range"/>
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
    <div style="display: flex; justify-content: flex-end;">
      <el-button icon="Plus" @click="() => handleDetail('add')">添加</el-button>
    </div>
    <el-table :size="isMobile?'small':'default'" style="width: 100%" ref="tableRef" @sort-change="handleSort"
              :row-key="row => row.id"
              :data="list">
      <el-table-column :width="60" align="center" label="序号" type="index"/>
      <el-table-column sortable="custom" prop="name" :min-width="200" label="提醒任务名称"/>
      <el-table-column sortable="custom" prop="person" :width="200" label="联系人"/>
      <el-table-column sortable="custom" prop="phone" :width="200" label="联系电话"/>
      <el-table-column sortable="custom" align="center" prop="start_date" :width="200" label="开始日期"/>
      <el-table-column sortable="custom" align="center" prop="end_date" :width="200" label="到期日期"/>
      <el-table-column sortable="custom" align="center" prop="state" :width="150" label="通知状态">
        <template #default="{row}">
          <template v-if="row?.state === '1'">
            <div style="color: #67C23A">已通知</div>
          </template>
          <template v-else>
            <div style="color: #E6A23C">未通知</div>
          </template>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" :width="60" label="操作">
        <template #default="{row}">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">
            <el-button type="warning" link @click="() => handleDetail('update', row?.id)">修改</el-button>
            <div/>
            <el-button type="danger" link @click="() => handleDelete(row?.id)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :size="isMobile?'small':'default'" style="width: 100%;" layout="total, prev, pager, next, ->, sizes"
                   v-model:page-size="query.per_page"
                   v-model:current-page="query.page" :total="total"
                   @change="getList"/>
    <DetailModal ref="detailRef"/>
  </div>
</template>

<style scoped>
</style>
