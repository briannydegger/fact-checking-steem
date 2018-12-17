<template>
    <div>
        <md-progress-bar md-mode="indeterminate" v-if="recuperating"></md-progress-bar>
        <fact
            v-for="post in posts"
            v-bind:key="post.id"
            :title="post.title"
            :active_votes="post.active_votes"
            :body="post.body"
            :number_comments="post.children"
            :author="post.author"
            :permlink="post.permlink"
        />
        <div v-if="posts.length == 0">There's no fact</div>
    </div>
</template>

<script>
import Fact from "../components/Fact.vue";
const dsteem = require("dsteem");

export default {
    name: "home",
    components: {
        Fact
    },
    data: () => ({
        posts: [],
        recuperating: false
    }),
    mounted: function() {
        this.recuperating = true;
        const client = new dsteem.Client("https://api.steemit.com");
        client.database
            .getDiscussions("hot", {
                tag: "fact-checking",
                limit: 5
            })
            .then(result => {
                if (result) {
                    this.posts = result;
                }
                this.recuperating = false;
            })
            .catch(err => {
                console.log(err);
            });
    }
};
</script>