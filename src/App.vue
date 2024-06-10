<script setup>
import { RouterLink, RouterView, useRouter, useRoute } from "vue-router";
import { ref, provide, inject } from "vue";
import axios from "axios";

import Avatar from "primevue/avatar";
import Button from "primevue/button";
import Badge from "primevue/badge";

import TabMenu from "primevue/tabmenu";
import Menubar from "primevue/menubar";

import Menu from "primevue/menu";

let authorizationToken = ref(document.cookie.split("=")[1]);

let username = ref("");

// let authorizationTokenFromLogin = inject("authorizationTokenFromLogin");

provide("authorizationToken", authorizationToken);
provie("username", username);

console.log("IM MAKING AN AUTHTOKEN", authorizationToken.value);

// let myAccount = await axios.get(`http://localhost:3000/api/users/${}`);

const menu = ref();
const items = ref([
  {
    label: "Posts",
    items: [
      {
        label: "Posts",
        icon: "pi pi-list",
        command: () => {
          router.push("/");
        },
      },
      {
        label: "Album",
        icon: "pi pi-folder",
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
    label: "User",
    items: [
      {
        label: "My account",
        icon: "pi pi-user",
        command: () => {
          router.push("/myAccount");
        },
      },
      {
        label: "Log out",
        icon: "pi pi-user-minus",
        command: () => {
          document.cookie = `smiglo-instapp="";expires=Thu, 01 Jan 1970 00:00:01 GMT`;
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
    <div
      style="
        position: absolute;
        right: 40px;
        top: 25px;
        display: flex;
        align-items: center;
        justif-content: center;
        gap: 10px;
        background: var(--primary-color);
        padding: 10px;
        border-radius: 10px;
      "
    >
      Username
      <Avatar
        image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
        style="width: 32px; height: 32px"
      />
    </div>
  </div>
  <Suspense>
    <router-view />
  </Suspense>
</template>