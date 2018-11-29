import Vue from "vue";
import App from './App.vue'
import router from "./router";
import store from "./store";
import VueMaterial from 'vue-material'
import VueRouter from 'vue-router'
import 'vue-material/dist/vue-material.min.css'

Vue.config.productionTip = false;

Vue.use(VueRouter)
Vue.use(VueMaterial)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
