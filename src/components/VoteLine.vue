<template>
    <span>
        {{ positiveVote + negativeVote + nullVote }} votes (&#128077; :
        <span
            v-bind:class="{ 'vote-highlight': positiveVote >= negativeVote && positiveVote >= nullVote }"
        >{{ positiveVote }}</span> | &#128528; :
        <span
            v-bind:class="{ 'vote-highlight': nullVote > negativeVote && nullVote > positiveVote }"
        >{{ nullVote }}</span> | &#128078; :
        <span
            v-bind:class="{ 'vote-highlight': negativeVote > positiveVote && negativeVote >= nullVote }"
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
