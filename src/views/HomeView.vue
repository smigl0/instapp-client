<script async setup>
import axios from "axios";
import { inject, reactive, ref } from "vue";
import { RouterLink, RouterView, useRouter, useRoute } from "vue-router";

import Chips from "primevue/chips";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Menu from "primevue/menu";
import Tag from "primevue/tag";
import SelectButton from "primevue/selectbutton";

const router = useRouter();

let authorizationToken = inject("authorizationToken");

let currentAuthToken;

let data = {
  headers: {
    Authorization: authorizationToken.value,
  },
};

let posts = reactive(await axios.get("http://localhost:3000/api/photos", data));

const toggle = (event) => {
  menu.value.toggle(event);
};

let visible = ref(false);
console.log(posts.data);

let currentInfo = ref({});
let currentFilter = ref("");

let currentTagsQuery = ref();

const showInfo = async (id) => {
  modalSelect.value = "Info";
  console.log("test");
  console.log(posts.data);
  console.log(id);
  currentInfo.value = posts.data[id];
  hashtags.value = [];
  currentImage.value = `http://localhost:3000/api/getImage/${currentInfo.value.id}`;
  currentTagsQuery.value = await axios.get(
    `http://localhost:3000/api/photos/tags/${currentInfo.value.id}`,
    data
  );
  visible.value = true;
};

const deleteImage = async (id) => {
  await axios.delete(`http://localhost:3000/api/photos/${id}`, data);
  posts = await axios.get("http://localhost:3000/api/photos", data);
  visible.value = false;
  // router.go();
};

const previewFilter = async ([id, filter]) => {
  console.log([id, filter]);
  currentImage.value = `http://localhost:3000/api/getImage/${filter}/${id}`;

  currentFilter.value = filter;
  beingFiltered.value = true;
};

const applyFilter = async (id) => {
  // visible.value = false;
  console.log(id);
  await axios.patch(
    "http://localhost:3000/api/filters",
    {
      id: id,
      filter: currentFilter.value,
    },
    {
      headers: {
        Authorization: authorizationToken.value,
      },
    }
  );
  router.go();
  console.log(posts);
  posts = await axios.get("http://localhost:3000/api/photos", data);
};

const submitTags = async (id) => {
  console.log(hashtags);

  let tagsFormData = new FormData();
  tagsFormData.append("tagNames", JSON.stringify(hashtags.value));

  axios.patch(
    `http://localhost:3000/api/photos/tags/mass/${id}`,
    tagsFormData,
    {
      headers: {
        Authorization: authorizationToken.value,
      },
    }
  );
  visible.value = false;
};

const options = ref(["Info", "Tags", "Filters"]);
const modalSelect = ref("Info");

let currentImage = ref(`http://localhost:3000/api/getImage/${currentInfo.id}`);
let beingFiltered = ref(false);

const filters = ref([
  "grayscale",
  "invert",
  "tint",
  "rotate",
  "flip",
  "flop",
  "sepia",
]);

let hashtags = ref([]);
</script>


<template>
  <Dialog
    modal
    v-model:visible="visible"
    style="width: 90wh; height: 90vh; box-sizing: border-box; overflow: hidden"
  >
    <template #container>
      <div
        style="width: 90vw; height: 100%; display: flex; flex-direction: row"
      >
        <div
          style="
            width: 50%;
            height: 100%;
            background-color: var(--gray-800);
            gap: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          "
        >
          <img :src="currentImage" width="100%" />
        </div>
        <div style="width: 100%; height: 100%">
          <div
            style="
              display: flex;
              justify-content: right;
              height: min-content;
              width: 100%;
            "
          >
            <Button
              icon="pi pi-times"
              rounded
              outlined
              aria-label="Filter"
              style="margin-right: 20px; margin-top: 20px"
              @click="visible = false"
            />
          </div>
          <div style="display: flex; justify-content: center">
            <SelectButton
              v-model="modalSelect"
              :options="options"
              aria-labelledby="basic"
            />
          </div>
          <div
            v-if="modalSelect == 'Info'"
            style="margin-left: 20px; width: calc(100% - 20px)"
          >
            <!-- {{ currentInfo }} -->
            <div style="margin-bottom: 10px">
              <p>id: {{ currentInfo.id }}</p>
              <p>Album: {{ currentInfo.album }}</p>
              <p>Original filename: {{ currentInfo.originalName }}</p>
              <p>Filtered state: {{ currentInfo.changes }}</p>
              <p>Changes: {{ currentInfo.history.length - 1 }}</p>
              <div style="display: flex; flex-direction: row; gap: 10px">
                <Tag
                  value="New"
                  style="max-width: min-content; font-size: 24px"
                  v-for="tag in currentTagsQuery.data"
                  v-bind:key="tag"
                  >{{ tag }}</Tag
                >
              </div>
            </div>
            <Button severity="danger" @click="deleteImage(currentInfo.id)">
              Delete
            </Button>
          </div>
          <div
            v-if="modalSelect == 'Tags'"
            style="
              margin-left: 20px;
              margin-right: 20px;
              width: calc(100% - 20px);
            "
          >
            <div class="card p-fluid">
              <div style="margin-right: 20px">
                <Chips v-model="hashtags" style="margin-bottom: 10px" />
                <Button @click="submitTags(currentInfo.id)"> Submit </Button>
              </div>

              <div
                style="
                  display: flex;
                  flex-direction: column;
                  gap: 10px;
                  margin-top: 10px;
                "
              >
                <!-- {{ currentTagsQuery.data }} -->
                <Tag
                  value="New"
                  style="max-width: min-content; font-size: 24px"
                  v-for="tag in currentTagsQuery.data"
                  v-bind:key="tag"
                  >{{ tag }}</Tag
                >
              </div>
            </div>
          </div>
          <div
            v-if="modalSelect == 'Filters'"
            style="
              height: calc(100% - 118px);
              width: calc(100% - 20px);
              margin-left: 20px;
              margin-top: 20px;
              overflow-y: scroll;
              display: flex;
              flex-wrap: wrap;
              flex-direction: row;
              justify-content: space-between;
              gap: 10px;
            "
          >
            <img
              class="filterOption"
              v-for="filter in filters"
              :src="`http://localhost:3000/api/getImage/${filter}/${currentInfo.id}`"
              width="300px"
              @click="previewFilter([currentInfo.id, filter])"
              v-bind:key="filter"
            />
            <Button
              label="Success"
              severity="success"
              style="position: absolute; right: 50px; bottom: 20px"
              @click="applyFilter(currentInfo.id)"
              v-if="beingFiltered"
            >
              Apply
            </Button>
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

.filterOption {
  box-sizing: border-box;
  border-radius: 10px;
}

.filterOption:hover {
  transition: 0.2s;
  border: solid var(--primary-color) 5px;
}
</style>