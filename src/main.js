import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueFire, VueFireAuth, VueFireFirestoreOptionsAPI, VueFireDatabaseOptionsAPI } from 'vuefire'
import { firebaseApp } from './firebase'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(VueFire, {
  firebaseApp,
  modules: [
    VueFireAuth(),
    VueFireFirestoreOptionsAPI(),
    VueFireDatabaseOptionsAPI()
  ]
})
app.use(createPinia())
app.use(router)

app.mount('#app')
