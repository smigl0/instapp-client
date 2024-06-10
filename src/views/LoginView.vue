<script setup>
import router from "@/router";
import axios from "axios";

import InputText from "primevue/inputtext";
import Password from "primevue/password";
import SelectButton from "primevue/selectbutton";
import Message from "primevue/message";
import { inject, ref } from "vue";

let username, password, mail;

const formSelect = ref("Login");
const options = ref(["Login", "Register"]);

let headers = inject('headers')
let authorizationToken = inject('authorizationToken')
authorizationToken=""

let count = ref(0);
let messages = ref([
  // { severity: "info", content: "Dynamic Info Message", id: count.value++ },
]);

let loginSubmit = async (event) => {
  event.preventDefault();
  let loginFormData = new FormData();

  loginFormData.append("username", username);
  loginFormData.append("password", password);

  try {
    let authConfirm = '';
      authConfirm = await axios.post(
      "http://127.0.0.1:3000/api/auth/login",
      loginFormData
    )            
    
    if (authConfirm.data) {
      var now = new Date();
      var time = now.getTime();
      var expireTime = time + 99 * 36000;
      now.setTime(expireTime);

      document.cookie = `smiglo-instapp=${
        authConfirm.data
      };expires=${now.toUTCString()};`;


      console.log(authConfirm.data);
      authorizationToken.value = authConfirm.data

      router.push("/");
    }
  } catch (error) {
    if (error.request.status == 401) {
      messages.value.push({
        severity: "error",
        content: "Wrong credentials",
        id: count.value++,
      });
    }
  }
};

let regiserSubmit = async (event) => {
  event.preventDefault();
  let loginFormData = new FormData();

  loginFormData.append("username", username);
  loginFormData.append("mail", mail);
  loginFormData.append("password", password);

  console.log(loginFormData);

  try {
    let authConfirm = await axios.post(
      "http://127.0.0.1:3000/api/auth/register",
      loginFormData,
      {
        headers:{
          'Content-Type':'multipart/form-data'
        }
      }
    );
    if (authConfirm) {
      messages.value.push({
        severity: "success",

        content: `Please visit <a href="http://127.0.0.1:3000/api/auth/confirm/${authConfirm.data}">this</a> link to authorize the account.`,
        id: count.value++,
      });
    }
  } catch (error) {
    if (error.request.status == 401) {
      console.log(error);
      messages.value.push({
        severity: "error",
        content: error.request.response,
        id: count.value++,
      });
    }
  }
};
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

  <div class="body-max">
    <form class="loginForm">
      <div>
        <img src="../input.png" style="width: 150px" />
        <SelectButton
          v-model="formSelect"
          :options="options"
          aria-labelledby="basic"
        />
        <span class="loginFields" v-if="formSelect == 'Login'">
          <label for="username">Username</label>
          <InputText
            name="username"
            type="text"
            v-model="username"
            aria-describedby="username-help"
          />
          <label for="password">Password</label>
          <Password
            type="password"
            v-model="password"
            :feedback="false"
            aria-describedby="password"
          />
          <button class="submit-btn" @click="loginSubmit">Submit</button>
        </span>
        <span class="loginFields" v-if="formSelect == 'Register'">
          <label for="username">Username</label>
          <InputText
            name="username"
            type="text"
            v-model="username"
            aria-describedby="username-help"
          />
          <label for="mail">E-mail</label>
          <InputText
            name="mail"
            type="text"
            v-model="mail"
            aria-describedby="mail-help"
          />
          <label for="password">Password</label>
          <Password
            type="password"
            v-model="password"
            :feedback="false"
            aria-describedby="password"
          />
          <button class="submit-btn" @click="regiserSubmit">Submit</button>
        </span>
      </div>
    </form>
  </div>
</template>

<style scoped>
html {
  width: 100%;
  height: 100%;
}

.body {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}

label {
  width: 100%;
}

.submit-btn {
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  max-width: min-content;
  font-family: var(--font-family);
  background: var(--purple-700);
  border: 0px solid black;
  border-radius: 5px;
  padding: 10px;
  max-width: 300px;
  display: flex;
  flex-shrink: 0;
}

.submit-btn:hover {
  transition: 0.7s box-shadow;
  transition: 0.2s background-color;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 3px 8px;
  background-color: var(--purple-900);
}

.loginForm {
  justify-content: center;
  align-items: center;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  border: solid 1px var(--surface-100);
  border-radius: 10px;
  padding: 20px;
  gap: 10px;
}

.loginForm > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  max-width: min-content;
}

.loginFields {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  max-width: min-content;
}
</style>