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

// Globals function and variable
Vue.prototype.$votesInit = {
    positiveVote: 0,
    negativeVote: 0,
    nullVote: 0,
    uncertain: false,
    percent: 100
};
Vue.prototype.$activeVotesToVotes = (active_votes) => {
    let votes = {
        positiveVote: 0,
        negativeVote: 0,
        nullVote: 0
    };

    active_votes.forEach(vote => {
        if (vote.percent < 0) {
            votes.negativeVote++;
        } else if (vote.percent < 100) {
            votes.nullVote++;
        } else {
            votes.positiveVote++;
        }
    });

    votes.uncertain = votes.positiveVote + votes.negativeVote < votes.nullVote;
    votes.percent = (
        (votes.positiveVote / (votes.positiveVote + votes.negativeVote)) *
        100
    ).toFixed(1);
    return votes;
};

new Vue({
    router,
    render: h => h(App)
}).$mount("#app");