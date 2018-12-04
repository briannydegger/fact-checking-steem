<template>
    <span class="voting-buttons">
        <span>
            <md-button
                v-on:click="changeVote(1)"
                class="md-raised"
                v-bind:class="{ 'md-primary': vote == 1 }"
            >&#128077;</md-button>
            <md-tooltip md-direction="bottom">True</md-tooltip>
        </span>
        <span>
            <md-button
                v-on:click="changeVote(2)"
                class="md-raised"
                v-bind:class="{ 'md-primary': vote == 2 }"
            >&#128528;</md-button>
            <md-tooltip md-direction="bottom">Details missing. Update infos or need more details.</md-tooltip>
        </span>
        <span>
            <md-button
                v-on:click="changeVote(0)"
                class="md-raised"
                v-bind:class="{ 'md-primary': vote == 0 }"
            >&#128078;</md-button>
            <md-tooltip md-direction="bottom">Fake</md-tooltip>
        </span>
    </span>
</template>

<script>
export default {
    name: "VotingLine",
    data: () => ({
        vote: -1
    }),
    methods: {
        changeVote: function(voteClicked) {
            this.vote = this.vote == voteClicked ? -1 : voteClicked;
        }
    }
};
</script>

<style lang="scss">
.voting-buttons {
    margin-top: 10px;
}

.voting-buttons .md-button {
    margin: 0px;
    min-width: 1%;
}
</style>
