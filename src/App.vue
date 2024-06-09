<script setup>
import { RouterLink, RouterView, useRouter, useRoute } from "vue-router";
import { ref } from "vue";
import axios from "axios";

import TabMenu from "primevue/tabmenu";
import Menubar from "primevue/menubar";

import Button from "primevue/button";
import Menu from "primevue/menu";

let authToken = document.cookie.split("=")[1];

const headers = {
  Authorization: `${authToken}`,
};

console.log(authToken);

const menu = ref();
const items = ref([
  {
    label: "Posts",
    items: [
      {
        label: "Posts",
        icon: "pi pi-refresh",
        command: () => {
          router.push("/");
        },
      },
      {
        label: "My Posts",
        icon: "pi pi-upload",
        command: () => {
          router.push("/myPosts");
        },
      },
    ],
  },
  {
    label: "Users",
    items: [
      {
        label: "All users",
        icon: "pi pi-refresh",
      },
      {
        label: "My account",
        icon: "pi pi-upload",
      },
    ],
  },
]);

const toggle = (event) => {
  menu.value.toggle(event);
};

const router = useRouter();
const route = useRoute();

if (!document.cookie) {
  router.push("/login");
}

console.log(router.currentRoute.value.fullPath);
</script>

<template>
  <div
    class="card flex justify-content-center"
    v-if="router.currentRoute.value.fullPath != '/login'"
  >
    <Button
      type="button"
      icon="pi pi-ellipsis-v"
      @click="toggle"
      aria-haspopup="true"
      aria-controls="overlay_menu"
      style="
        margin: 20px;
        position: absolute;
        aspect-ratio: 1/1;
        top: 10px;
        left: 10px;
      "
    />
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true"> </Menu>
  </div>
  <Suspense>
    <router-view />
  </Suspense>
</template>