import Vue from "vue";
import App from './App.vue';
import router from "./router";
import VueMaterial from 'vue-material';
import VueRouter from 'vue-router';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import 'babel-polyfill';

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(VueMaterial);

new Vue({
    router,
    render: h => h(App)
}).$mount("#app");