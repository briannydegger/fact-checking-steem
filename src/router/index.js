import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
    scrollBehavior() {
        return {
            x: 0,
            y: 0
        }
    },
    routes: [{
            path: "/",
            component: () => import("@/views/Home")
        },
        {
            path: "/about",
            component: () => import("@/views/About")
        },
        {
            path: "/add",
            component: () => import("@/views/Add")
        },
        {
            path: "/fact/:author/:permlink",
            component: () => import("@/views/Fact")
        }
    ]
});