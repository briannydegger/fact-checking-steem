<template>
    <span>
        (&#128077; :
        <span
            v-bind:class="{ voteHighlight: positiveVote >= negativeVote && positiveVote >= nullVote }"
        >{{ positiveVote }}</span> | &#128528; :
        <span
            v-bind:class="{ voteHighlight: nullVote > negativeVote && nullVote > positiveVote }"
        >{{ nullVote }}</span> | &#128078; :
        <span
            v-bind:class="{ voteHighlight: negativeVote > positiveVote && negativeVote >= nullVote }"
        >{{ negativeVote }}</span>)
    </span>
</template>

<script>
export default {
    name: "VoteLine",
    props: {
        positiveVote: Number,
        negativeVote: Number,
        nullVote: Number
    }
};
</script>

<style lang="scss">
.vote-highlight {
    text-decoration: underline;
}
</style>
