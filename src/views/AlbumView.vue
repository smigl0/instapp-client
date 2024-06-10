<script setup>
import axios from "axios";
import { inject, ref } from "vue";

import Button from "primevue/button";
import Dialog from "primevue/dialog";

let authorizationToken = inject("authorizationToken");

let data = {
  headers: {
    Authorization: authorizationToken.value,
  },
};

let posts = (await axios.get("http://localhost:3000/api/photos", data)).data;

let postImages = posts.map((element) => [
  element.album,
  `http://localhost:3000/api/getImage/${element.id}`,
]);
let postImagesSelected = ref([]);

console.log(postImages);

let postAlbums = posts.map((element) => element.album).sort();

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

let albums = postAlbums.filter(onlyUnique);

let albumCovers = [];

console.log(albums);
console.log(posts);

for (let i = 0; i < postAlbums.length; i++) {
  for (let ii = 0; ii < posts.length; ii++) {
    if (postAlbums[i] == posts[ii].album) {
      albumCovers.push(`http://localhost:3000/api/getImage/${posts[ii].id}`);
      break;
    }
  }
}

console.log(albumCovers);

let albumCoverImgs = albumCovers.map((element) => {
  let image = new Image();
  image.src = element;

  return image;
});

let selectedAlbum = ref("");

const selectAlbum = (albumName) => {
  console.log(albumName);
  selectedAlbum.value = albumName;
  postImagesSelected = postImages.filter((element) => {
    console.log(element);
    if (albumName == element[0]) {
      return element[1];
    }
  });
  console.log(postImagesSelected);
};

let visible = ref(false);
let visibleImgSrc = ref("");

const showImage = (src) => {
  console.log(src);
  visibleImgSrc = src;
  visible.value = true;
};

console.log(albumCoverImgs);
</script>


<template>
  <Dialog
    modal
    v-model:visible="visible"
    style="box-sizing: border-box; overflow: hidden"
  >
    <template #container>
      <Button
        icon="pi pi-times"
        rounded
        outlined
        aria-label="Filter"
        style="position: absolute; z-index: 5; background: black; margin: 10px"
        @click="visible = false"
      />
      <img :src="visibleImgSrc" style="position: relative" />
    </template>
  </Dialog>
  <div
    style="
      display: flex;
      width: calc(100% - 160px);
      height: 200px;
      gap: 20px;
      flex-direction: row;
      justify-content: left;
      flex-wrap: wrap;
      margin: 80px;
      margin-bottom: 0px;
      margin-left: 80px;
      margin-right: 80px;
    "
    v-if="selectedAlbum == ''"
  >
    <div
      :background-image="albumCovers[id]"
      class="album"
      v-for="(item, id) in albums"
      v-bind:key="item"
      @click="selectAlbum(item)"
    >
      <div>{{ item }}</div>
      <img :src="albumCovers[id]" />
    </div>
  </div>
  <div
    style="
      display: flex;
      width: calc(100% - 160px);
      height: 200px;
      gap: 20px;
      flex-direction: row;
      justify-content: left;
      flex-wrap: wrap;
      margin: 80px;
      margin-bottom: 0px;
      margin-left: 80px;
      margin-right: 80px;
    "
    v-else
  >
    <div
      class="album"
      style="
        background-color: var(--primary-color);
        display: flex;
        align-items: center;
        justify-content: center;
      "
      @click="selectedAlbum = ''"
    >
      <i class="pi pi-undo" style="font-size: 50px"></i>
    </div>
    <div
      :background-image="albumCovers[id]"
      class="album"
      v-for="(item, id) in postImagesSelected"
      v-bind:key="item"
      @click="showImage(item[1])"
    >
      <div style="background-color: rgba(0, 0, 0, 0)"></div>
      <img :src="item[1]" />
    </div>
  </div>
</template>

<style scoped>
.album {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 15px;
  overflow: hidden;
}

.album:hover {
  scale: 1.1;
  transition: 0.5s;
}

.album > div {
  position: relative;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.55);
  z-index: 5;
}

.album > img {
  position: relative;
  top: -200px;
  height: 100%;
}
</style>