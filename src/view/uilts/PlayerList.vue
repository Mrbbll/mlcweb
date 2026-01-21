<script setup>
    import { onMounted, ref } from 'vue'
    import axios from 'axios'
    
    
    let tableData = ref([])
    let show = ref(true)
    const query = async()=>{
        const res = await axios.get("http://127.0.0.1:8080/playerlist")
        tableData.value = res.data.data
        console.log(res.data.data)
    
    };

    onMounted(()=>{
        query()
    })

    
    </script>
    
    <template>
        <el-button @click="show = !show">Click Me</el-button>
        <el-collapse-transition>
            <div v-show="show">
            <el-card v-for="value in tableData" :key="value.uuid" class="player-card" shadow="always">
                <div>
                    <span>{{ value.name }}</span>
                </div>
                <div>
                    <span>ID: {{ value.uuid }}</span>
                </div>
                <div>
                    <span>expiresOn: {{ value.expiresOn }}</span>
                </div>
            </el-card>
            </div>
        </el-collapse-transition>


      <!-- <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="uuid" label="ID" width="380" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="expiresOn" label="expiresOn" width="380" />
      </el-table> -->
      <el-backtop :right="100" :bottom="100" />
    </template>
    
    
    
    <style scoped>
    .player-card{
        margin-bottom: 20px;
    }
    </style>
    