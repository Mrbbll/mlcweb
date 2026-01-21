<script setup>
 import Money from '../uilts/Money.vue'
 import sidemenu from './sidemenu.vue'
</script>


<template>
    <div>
        <el-container >
      <el-aside width="200px" class="bg-color-1">
        <sidemenu />
      </el-aside>
      <el-main class="bg-color-2">
        <el-header>Header</el-header>
        <router-view />
        <el-footer>Footer</el-footer>
      </el-main>

    </el-container>
    </div>

</template>

<style scoped>
.bg-color-1{
    background-color: #ffffff;
}
.bg-color-2{
    background-color: #ffffff;
}
</style>
