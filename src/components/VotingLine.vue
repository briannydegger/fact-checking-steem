<template>
    <span class="voting-buttons">
        <span>
            <md-button
                v-on:click="changeVote(1)"
                class="md-raised"
                v-bind:class="{ 'md-primary': vote == 1 }"
                :disabled="disabled"
            >&#128077;</md-button>
            <md-tooltip md-direction="bottom">{{ nullVoteEnable ? "True" : "Upvote"}}</md-tooltip>
        </span>
        <span v-if="nullVoteEnable">
            <md-button
                v-on:click="changeVote(2)"
                class="md-raised"
                v-bind:class="{ 'md-primary': vote == 2 }"
                :disabled="disabled"
            >&#128528;</md-button>
            <md-tooltip md-direction="bottom">Details missing. Update infos or need more details.</md-tooltip>
        </span>
        <span>
            <md-button
                v-on:click="changeVote(0)"
                class="md-raised"
                v-bind:class="{ 'md-primary': vote == 0 }"
                :disabled="disabled"
            >&#128078;</md-button>
            <md-tooltip md-direction="bottom">{{ nullVoteEnable ? "Fake" : "Downvote"}}</md-tooltip>
        </span>
    </span>
</template>

<script>
export default {
    name: "VotingLine",
    props: {
        opinion: {
            type: Number,
            default: -1
        },
        author: String,
        permlink: String,
        nullVoteEnable: {
            type: Boolean,
            default: true
        }
    },
    data: function() {
        return {
            vote: this.opinion,
            disabled: false
        };
    },
    watch: {
        // Change opinion
        opinion: function(opinion) {
            if (!this.disabled) {
                this.vote = opinion;
            }
        }
    },
    methods: {
        voteToStringVote: vote => {
            switch (vote) {
                case 0:
                    return "negativeVote";
                case 1:
                    return "positiveVote";
                case 2:
                    return "nullVote";
                default:
                    return "";
            }
        },
        changeVote: function(voteClicked) {
            // Only for connected user
            if (!this.$user.getUsername()) {
                alert("You have to be logged !");
                return false;
            }

            this.disabled = true;
            let newVote = this.vote == voteClicked ? -1 : voteClicked;

            let that = this;
            // Send vote
            // Positif : 10000
            // Negatif : -0000
            // Null : 1
            // No vote : 0 (cancel current vote)
            this.$apiSteemconnect.vote(
                this.$user.getUsername(),
                this.author,
                this.permlink,
                newVote == 0
                    ? -10000
                    : newVote == 1
                    ? 10000
                    : newVote == 2
                    ? 1
                    : 0,
                function(err) {
                    let newState = [];
                    newState[that.voteToStringVote(that.vote)] = -1;
                    newState[that.voteToStringVote(newVote)] = 1;
                    if (err) {
                        alert(err.error_description);
                    } else {
                        that.vote = newVote;
                        // Send to component parent new vote
                        that.$emit("change", newState, newVote);
                    }
                    that.disabled = false;
                }
            );
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
