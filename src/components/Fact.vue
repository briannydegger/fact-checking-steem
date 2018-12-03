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
                432 comments | {{ totalVote }} votes (&#128077; :
                <span
                    v-bind:class="{ highlight: positiveVote >= negativeVote && positiveVote >= nullVote }"
                >{{ positiveVote }}</span>
                | &#128078; :
                <span
                    v-bind:class="{ highlight: negativeVote > positiveVote && negativeVote >= nullVote }"
                >{{ negativeVote }}</span> | &#128566; :
                <span
                    v-bind:class="{ highlight: nullVote > negativeVote && nullVote > positiveVote }"
                >{{ nullVote }}</span>)
            </div>
        </md-card-header>
    </md-card>
</template>

<script>
export default {
    name: "Fact",
    props: {
        id: Number,
        positiveVote: Number,
        negativeVote: Number,
        nullVote: Number
    },
    data: function() {
        return {
            totalVote: this.positiveVote + this.negativeVote + this.nullVote,
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
