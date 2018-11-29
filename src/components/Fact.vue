<template>
    <md-card class="fact-cart">
        <md-card-content class="percent">
            <md-avatar class="md-avatar-icon" v-bind:class="{ 'percent-good': percent > 49 }">
                {{ percent }}%
                <md-tooltip
                    md-direction="bottom"
                >{{ percent }}% of people who voted think this is true</md-tooltip>
            </md-avatar>
        </md-card-content>

        <md-card-header>
            <router-link to="/about">
                <div class="md-title">title</div>
            </router-link>
            <div class="md-subhead">432 comments | 432 votes</div>
        </md-card-header>
    </md-card>
</template>

<script>
export default {
    name: "Fact",
    props: {
        id: Number,
        percent: Number
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
    font-size: 12pt;
    color: black !important;
    background-color: #ff5050 !important;
}

.percent-good {
    background-color: #50ff50 !important;
}
</style>
