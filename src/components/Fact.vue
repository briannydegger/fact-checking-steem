<template>
    <md-card class="fact-card">
        <md-card-content class="percent">
            <percent :votes="votes"/>
        </md-card-content>

        <md-card-header>
            <router-link :to="'/fact/' + author + '/' + permlink">
                <div class="md-title">{{ title }}</div>
            </router-link>
            <div class="md-subhead">
                <vote-line :votes="votes"></vote-line>
                <span>| {{ number_comments }} comments</span>
            </div>
        </md-card-header>
    </md-card>
</template>

<script>
import VoteLine from "./VoteLine.vue";
import Percent from "../components/Percent";

export default {
    name: "Fact",
    components: {
        VoteLine,
        Percent
    },
    props: {
        title: String,
        active_votes: Array,
        body: String,
        number_comments: Number,
        author: String,
        permlink: String
    },
    data: function() {
        return {
            votes: this.$activeVotesToVotes(this.active_votes)
        };
    }
};
</script>

<style lang="scss">
.fact-card {
    width: calc(100% - 20px);
    margin: 4px;
    height: 85px;
}

.fact-card .percent {
    float: left;
    width: 60px;
    height: 85px;
    line-height: 85px;
    margin-right: 20px;
    padding-top: 0px;
    text-align: center;
}

.fact-card .highlight {
    text-decoration: underline;
}

.fact-card .md-title {
    font-size: 20pt;
    white-space: nowrap;
}
</style>
