<script async setup>
import axios from "axios";
import { ref } from "vue";

import Button from "primevue/button";
import Menu from "primevue/menu";

let authToken = document.cookie.split("=")[1];

const headers = {
  Authorization: `${authToken}`,
};

const toggle = (event) => {
  menu.value.toggle(event);
};

let posts = await axios.get("http://localhost:3000/api/photos", {
  headers: headers,
});

console.log(posts.data);
</script>

  
<template>
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
      @click="console.log(id)"
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