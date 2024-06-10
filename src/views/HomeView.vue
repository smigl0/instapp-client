<script async setup>
import axios from "axios";
import { inject, ref } from "vue";

import Dialog from 'primevue/dialog';
import Button from "primevue/button";
import Menu from "primevue/menu";
import SelectButton from "primevue/selectbutton";


let authorizationToken = inject('authorizationToken')

const toggle = (event) => {
  menu.value.toggle(event);
};

let data = {headers:{
  'Authorization':authorizationToken._rawValue
}};


let posts = await axios.get("http://localhost:3000/api/photos", data);

let visible = ref(false)
console.log(posts.data);

let currentInfo = ref({})

const showInfo = (id)=>{
  modalSelect.value = "Info"
  console.log('test');
  visible.value = true
  console.log(posts.data);
  console.log(id);
  currentInfo.value = posts.data[id]
}

const options = ref(["Info", "Tags","Filters"]);
const modalSelect = ref("Info")
</script>


<template>
  <Dialog modal v-model:visible="visible" style="width:90wh;height:90vh;box-sizing:border-box;overflow:hidden;">
    <template #container>
      <div style="width:90vw;height:100%;display:flex;flex-direction:row;">
        <div style="width:50%;height:100%;background-color:var(--gray-800);gap:10px;display:flex;flex-direction:column;justify-content:center;align-items:center">
          <img :src="`http://localhost:3000/api/getImage/${currentInfo.id}`" width="100%">
        </div>
          <div style="width:100%;height:100%;">
            <div style="display:flex;justify-content:right;height:min-content;width:100%;">
            <Button icon="pi pi-times" rounded outlined aria-label="Filter" style="margin-right:20px;margin-top:20px;" @click="visible=false"/>
          </div>
          <div style="display:flex;justify-content:center;">
            <SelectButton
            v-model="modalSelect"
            :options="options"
            aria-labelledby="basic"
          />
          </div>
          <div v-if="modalSelect =='Info'">
          <!-- {{ currentInfo }} -->
          <p>id: {{currentInfo.id}}</p>
          <p>Album: {{currentInfo.album}}</p>
          <p>Original filename: {{currentInfo.originalName}}</p>
          <p>Filtered state: {{currentInfo.changes}}</p>
          <p>Changes: {{currentInfo.history.length -1}}</p>
          </div>
          </div>
      </div>
    </template>
  </Dialog>
  <div
    style="
  margin-left: 10%; 
  margin-top: 100px; 
  max-width: 90%

  display: grid;
  grid-template-columns: repeat(auto-fill, 30%);
  grid-auto-rows: 10px;
  justify-content: center;
  "
  >
    <img
      v-for="(item, id) in posts.data"
      :key="item"
      style="
        background: var(--gray-900);
        border-radius: 15px;
        min-width: 30%;
        max-width: 30%;
        margin: 5px 5px;
      "
      class="postImage"
      @click="showInfo(id)"
      :src="`http://localhost:3000/api/getImage/${item.id}`"
    />
  </div>
</template>

<style scoped>
.postImage {
  box-sizing: border-box;
}

.postImage:hover {
  transition: 0.5s;
  scale: 1.1;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}
</style>