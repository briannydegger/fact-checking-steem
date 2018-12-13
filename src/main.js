import Vue from "vue";
import App from './App.vue';
import router from "./router";
import VueMaterial from 'vue-material';
import VueRouter from 'vue-router';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import 'babel-polyfill';
const dsteem = require("dsteem");
import Remarkable from "remarkable";

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(VueMaterial);

// Globals function and variable
Vue.prototype.$votesInit = {
    positiveVote: 0,
    negativeVote: 0,
    nullVote: 0,
    opinions: [],
    uncertain: false,
    percent: 100
};
Vue.prototype.$activeVotesToVotes = (active_votes) => {
    let votes = {
        positiveVote: 0,
        negativeVote: 0,
        nullVote: 0,
        opinions: [],
        uncertain: false,
        percent: 100
    };

    active_votes.forEach(vote => {
        if (vote.percent != 0) {
            if (vote.percent < 0) {
                votes.negativeVote++;
                votes.opinions[vote.voter] = 0;
            } else if (vote.percent < 100) {
                votes.nullVote++;
                votes.opinions[vote.voter] = 2;
            } else {
                votes.positiveVote++;
                votes.opinions[vote.voter] = 1;
            }
        }
    });

    votes.uncertain = votes.positiveVote + votes.negativeVote < votes.nullVote;
    votes.percent = (
        (votes.positiveVote / (votes.positiveVote + votes.negativeVote)) *
        100
    ).toFixed(1);
    return votes;
};
Vue.prototype.$dsteemClient = new dsteem.Client("https://api.steemit.com");
Vue.prototype.$md = new Remarkable({
    html: true,
    linkify: true
});
class User {
    constructor() {
        this.username = "";
    }

    setUsername(name) {
        this.username = name;
    }

    getUsername() {
        return this.username;
    }
}
Vue.prototype.$username = new User();

new Vue({
    router,
    render: h => h(App)
}).$mount("#app");