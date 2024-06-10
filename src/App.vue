<script setup>
import { RouterLink, RouterView, useRouter, useRoute } from "vue-router";
import { ref,provide,inject } from "vue";
import axios from "axios";

import TabMenu from "primevue/tabmenu";
import Menubar from "primevue/menubar";

import Button from "primevue/button";
import Menu from "primevue/menu";

let authorizationToken = ref(document.cookie.split("=")[1])

console.log("IM MAKING AN AUTHTOKEN",authorizationToken.value);
provide('authorizationToken',authorizationToken)

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
        label: "Album",
        icon: "pi pi-upload",
        command: () => {
          router.push("/albums");
        },
      },
      {
        label: "Upload",
        icon: "pi pi-upload",
        command: () => {
          router.push("/upload");
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
        label: "Log out",
        icon: "pi pi-user-minus",
        command: () => {
          document.cookie = `smiglo-instapp="";expires=Thu, 01 Jan 1970 00:00:01 GMT`
          router.push("/login");
        },
      },
    ],
  },
]);

const toggle = (event) => {
  menu.value.toggle(event);
};

const router = useRouter();
const route = useRoute();

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