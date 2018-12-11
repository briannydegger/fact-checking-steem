<template>
    <md-card class="fact-card">
        <md-card-content class="percent">
            <md-avatar class="md-avatar-icon" v-bind:class="{ 'percent-good': percent > 49 }">
                {{ percent }}%
                <md-tooltip
                    md-direction="bottom"
                >{{ percent }}% of people who voted think this is true</md-tooltip>
            </md-avatar>
            <template v-if="uncertain">
                <span class="notif">&#9888;</span>
                <md-tooltip md-direction="left">This fact need more details or comments !</md-tooltip>
            </template>
        </md-card-content>

        <md-card-header>
            <router-link :to="'/fact/' + this.$vnode.key">
                <div class="md-title">{{ title }}</div>
            </router-link>
            <div class="md-subhead">
                <vote-line
                    :positiveVote="positiveVote"
                    :negativeVote="negativeVote"
                    :nullVote="nullVote"
                ></vote-line>
                <span>| {{ number_comments }} comments</span>
            </div>
        </md-card-header>
    </md-card>
</template>

<script>
import VoteLine from "./VoteLine.vue";

export default {
    name: "Fact",
    components: {
        VoteLine
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
        let positiveVote = 0;
        let negativeVote = 0;
        let nullVote = 0;

        this.active_votes.forEach(vote => {
            if (vote.percent < 0) {
                negativeVote++;
            } else if (vote.percent < 100) {
                nullVote++;
            } else {
                positiveVote++;
            }
        });

        return {
            positiveVote: positiveVote,
            negativeVote: negativeVote,
            nullVote: nullVote,
            uncertain: positiveVote + negativeVote < nullVote,
            percent: (
                (positiveVote / (positiveVote + negativeVote)) *
                100
            ).toFixed(1)
        };
    }
};
</script>

<style lang="scss" scoped>
.fact-card {
    width: calc(100% - 20px);
    margin: 4px;
    height: 85px;
}

.percent {
    float: left;
    width: 60px;
    height: 85px;
    line-height: 85px;
    margin-right: 20px;
    padding-top: 0px;
    text-align: center;
}

.md-avatar-icon {
    font-size: 8pt;
    color: black !important;
    background-color: white !important;
    border: 1px solid #ff5050;
}

.percent-good {
    border: 1px solid #50ff50;
}

.notif {
    position: absolute;
    left: 8px;
    bottom: 15px;
    user-select: none;
    cursor: default;
    font-size: 14pt;
}

.highlight {
    text-decoration: underline;
}

.fact-card .md-title {
    font-size: 20pt;
    white-space: nowrap;
}
</style>
