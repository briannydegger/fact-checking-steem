<template>
    <span>
        {{ votes.positiveVote + votes.negativeVote + votes.nullVote }} votes (&#128077; :
        <span
            v-bind:class="{ 'vote-highlight': votes.positiveVote >= votes.negativeVote && votes.positiveVote > votes.nullVote }"
        >{{ votes.positiveVote }}</span>
        <template v-if="nullVoteEnable">
            | &#128528; :
            <span
                v-bind:class="{ 'vote-highlight': votes.nullVote >= votes.negativeVote && votes.nullVote >= votes.positiveVote }"
            >{{ votes.nullVote }}</span>
        </template>&nbsp;| &#128078; :
        <span
            v-bind:class="{ 'vote-highlight': votes.negativeVote > votes.positiveVote && votes.negativeVote > votes.nullVote }"
        >{{ votes.negativeVote }}</span>)
    </span>
</template>

<script>
export default {
    name: "VoteLine",
    props: {
        votes: Object,
        nullVoteEnable: {
            type: Boolean,
            default: true
        }
    }
};
</script>

<style lang="scss">
.vote-highlight {
    text-decoration: underline;
}
</style>
