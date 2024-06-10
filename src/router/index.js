import { createRouter, createWebHistory } from 'vue-router'
import AlbumView from '../views/AlbumView.vue'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import UploadView from "../views/UploadView.vue"
import PageNotFound from "../views/PageNotFound.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/albums',
      name: 'Albums',
      component: AlbumView
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/upload',
      name: 'Upload',
      component: UploadView
    },
    { path: "/:pathMatch(.*)*", component: PageNotFound }
  ]
})

router.beforeEach((to, from, next) => {
  if (!document.cookie) {
    if (to.name != "Login") {
      next({
        path: '/login',
        replace: true
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
