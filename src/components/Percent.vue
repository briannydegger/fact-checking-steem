<template>
    <span class="percent-container">
        <md-avatar class="md-avatar-icon" v-bind:class="{ 'percent-good': votes.percent >= 50 }">
            {{ votes.percent }}%
            <md-tooltip
                md-direction="bottom"
            >{{ votes.percent }}% of people who voted think this is true</md-tooltip>
        </md-avatar>
        <template v-if="votes.uncertain">
            <span class="notif-uncertain">&#9888;</span>
            <md-tooltip md-direction="left">This fact need more votes, details or comments !</md-tooltip>
        </template>
    </span>
</template>

<script>
export default {
    name: "Percent",
    props: {
        votes: Object
    }
};
</script>

<style lang="scss">
.md-avatar-icon {
    font-size: 8pt;
    color: black !important;
    background-color: white !important;
    border: 1px solid #ff5050;
}

.votes-line .percent-container .md-avatar-icon {
    top: 0px;
}

.md-avatar-icon.percent-good {
    border: 1px solid #50ff50;
}

.notif-uncertain {
    position: absolute;
    left: 8px;
    bottom: 15px;
    user-select: none;
    cursor: default;
    font-size: 14pt;
}

.votes-line .notif-uncertain {
    left: 8px;
    bottom: 37px;
}
</style>
