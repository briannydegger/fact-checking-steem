import Vue from "vue";
import App from './App.vue';
import router from "./router";
import VueMaterial from 'vue-material';
import VueRouter from 'vue-router';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import sc2 from "steemconnect";
import 'babel-polyfill';
const dsteem = require("dsteem");
import Remarkable from "remarkable";

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(VueMaterial);

/* eslint-disable no-console */

// Globals function and variable
// init steemconnect
Vue.prototype.$apiSteemconnect = sc2.Initialize({
    app: "fact-checking",
    callbackURL: "https://fact-checking-steem.herokuapp.com/",
    accessToken: "access_token",
    scope: ["vote", "comment", "comment_options"]
});

// Object contains all votes about a fact
Vue.prototype.$votesInit = {
    positiveVote: 0, // Counter positive
    negativeVote: 0, // Counter negative
    nullVote: 0, // Counter null
    opinions: [], // List of users who vote, with their vote
    uncertain: false, // If fact need more vote, or details...
    percent: 100 // Percent of people who voted think this is true
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
            } else if (vote.percent == 1) {
                votes.nullVote++;
                votes.opinions[vote.voter] = 2;
            } else {
                votes.positiveVote++;
                votes.opinions[vote.voter] = 1;
            }
        }
    });

    votes.update = () => {
        let totalVote = votes.positiveVote + votes.negativeVote;
        votes.uncertain = totalVote <= votes.nullVote;
        votes.percent = (totalVote == 0 ? 50 :
            (votes.positiveVote / (totalVote)) *
            100
        ).toFixed(1);
    };
    votes.update();

    return votes;
};

// Init variable of dsteem with url of steemit.com
Vue.prototype.$dsteemClient = new dsteem.Client("https://api.steemit.com");

// Md is use for rendering Markdown
Vue.prototype.$md = new Remarkable({
    html: true,
    linkify: true
});

// Class about connected user
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
Vue.prototype.$user = new User();

new Vue({
    router,
    render: h => h(App)
}).$mount("#app");