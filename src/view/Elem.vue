<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

import { ElButton } from 'element-plus'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'

let tableData = ref([])
const query = async()=>{
    const res = await axios.get("http://localhost:8080/data")
    tableData.value = res.data.reslist
    console.log(res.data)

}
onMounted(()=>{
    query()
})

</script>

<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="player_uuid" label="ID" width="380" />
    <el-table-column prop="player_name" label="Name" width="180" />
    <el-table-column prop="money" label="Money" width="180" />
  </el-table>
  <el-backtop :right="100" :bottom="100" />
</template>



<style scoped>

</style>
