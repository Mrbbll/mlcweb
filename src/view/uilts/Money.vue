<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

let tableData = ref([])
const query = async()=>{
    const res = await axios.get("http://127.0.0.1:8080/money")
    tableData.value = res.data.data
    console.log(res.data.data)

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
