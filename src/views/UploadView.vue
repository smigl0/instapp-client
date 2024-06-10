<script setup>

import InputText from "primevue/inputtext";
import FileUpload from 'primevue/fileupload';   
import Button from 'primevue/button';
import Message from "primevue/message";

import { inject, ref } from "vue";
import axios from "axios";
import router from "@/router";


let authorizationToken = inject("authorizationToken")

let count = ref(0)
let messages = ref([
  // { severity: "info", content: "Dynamic Info Message", id: count.value++ },
]);


const uploadSubmit = async (e)=>{
    

    e.preventDefault()
    console.log(file);
    console.log(albumName);
    if(file != undefined){
        console.log(file);
        
        let successBool = true

        let uploadFormData = new FormData()

        if(file.name == undefined){
            messages.value.push({ severity: "error", content: "Please select a file", id: count.value++ })
            successBool=false
        }

        if(albumName.value == undefined){
            messages.value.push({ severity: "error", content: "Please write an album name", id: count.value++ })
            successBool= false
        }

        if(successBool){
            uploadFormData.append("file",file)
            uploadFormData.append("album",albumName.value)


            console.log(authorizationToken.value);
            
            let resp = await axios.post("http://localhost:3000/api/photos",uploadFormData,{headers:{'Authorization':authorizationToken._rawValue}})
            console.log('Myresp',resp);
            router.push('/')
        }
    }
}

let file = ref();
let albumName = ref()
const onFileSelect =(e)=>{
    file = e.files[0];
}

let files;

</script>

<template>
  <transition-group
    name="p-message"
    tag="div"
    style="position: absolute; right: 20px"
  >
    <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">
      <div v-html="msg.content"></div>
    </Message>
  </transition-group>
    <div style="position:absolute;margin-left:10vw;margin-top:10vh;display:flex;flex-direction:column;gap:10px;">
            <label name="album_name">Album name:</label>
            <InputText aria-describedby="album_name" v-model="albumName" />
            <FileUpload mode="basic" name="files" accept="image/png" :maxFileSize="1000000" style="width:100%;" @select="onFileSelect($event)" v-model="files" />
            <Button icon="pi pi-check" label="Submit" @click="uploadSubmit" />
    </div>
</template>