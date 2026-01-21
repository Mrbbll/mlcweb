<script setup>

</script>

<template>
  <div class="sidemenu">
    <h5 class="header">Default colors</h5>
    <el-menu 
        default-active="1"
        active-text-color="#ffd04b"
        background-color="#545c64"

        text-color="#fff"
        width="100%"
        router
      >
        <el-menu-item index="1">
          <span index="/picture">Picture</span>
        </el-menu-item>
        <el-menu-item index="2">
          <span index="/player">Player</span>
        </el-menu-item>
        <el-menu-item index="3">
          <span index="/map">Map</span>
        </el-menu-item>
        <el-menu-item index="4">
            <span index="/money">Money</span>
        </el-menu-item>
      </el-menu>
  </div>

</template>

<style scoped>
.sidemenu{
    position: fixed;
}
.header{
    margin-left: 20px;
}
</style>