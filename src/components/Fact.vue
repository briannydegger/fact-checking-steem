<template>
    <md-card class="fact-cart">
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
            <router-link :to="'/fact/' + id">
                <div class="md-title">title</div>
            </router-link>
            <div class="md-subhead">
                <span>432 comments |</span>
                <vote-line
                    :positiveVote="positiveVote"
                    :negativeVote="negativeVote"
                    :nullVote="nullVote"
                ></vote-line>
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
        id: Number,
        positiveVote: Number,
        negativeVote: Number,
        nullVote: Number
    },
    data: function() {
        return {
            uncertain: this.positiveVote + this.negativeVote < this.nullVote,
            percent: (
                (this.positiveVote / (this.positiveVote + this.negativeVote)) *
                100
            ).toFixed(1)
        };
    }
};
</script>

<style lang="scss" scoped>
.fact-cart {
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
</style>
