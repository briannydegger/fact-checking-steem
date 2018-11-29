import Vue from "vue";
import Vuex from "vuex";

import home from "./home.module";
import about from "./about.module";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        home,
        about
    }
});
