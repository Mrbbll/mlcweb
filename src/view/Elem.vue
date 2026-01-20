<script setup>
import { ref } from 'vue'
import { ElButton } from 'element-plus'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'

const tableData = ref([])



</script>

<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
  <el-backtop :right="100" :bottom="100" />
</template>

<style scoped>

</style>
