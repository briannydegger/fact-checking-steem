<template>
    <div>
        <fact
            v-for="post in posts.filter(filterPosts)"
            v-bind:key="post.id"
            :title="post.title"
            :active_votes="post.active_votes"
            :body="post.body"
            :number_comments="post.children"
            :author="post.author"
            :permlink="post.permlink"
        />
        <md-progress-bar md-mode="indeterminate" v-if="recuperating"></md-progress-bar>
        <div v-if="posts.length == 0 && !recuperating">There's no fact</div>
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
    props: {
        filter: String
    },
    data: () => ({
        posts: [],
        recuperating: false,
        fetchTouchEnd: false
    }),
    methods: {
        fetchFacts() {
            if (!this.recuperating && !this.fetchTouchEnd) {
                this.recuperating = true;
                let params = { tag: "fact-checking-app", limit: 20 };
                if (this.posts.length > 0) {
                    params.start_author = this.posts[
                        this.posts.length - 1
                    ].author;
                    params.start_permlink = this.posts[
                        this.posts.length - 1
                    ].permlink;
                }
                this.$dsteemClient.database
                    .getDiscussions("created", params)
                    .then(result => {
                        this.recuperating = false;
                        if (result) {
                            // Remove duplicates
                            for (var i = 0; i < result.length; ++i) {
                                for (var j = 0; j < this.posts.length; ++j) {
                                    if (result[i].id === this.posts[j].id) {
                                        result.splice(i, 1);
                                        break;
                                    }
                                }
                            }
                            if (result.length == 0) {
                                this.fetchTouchEnd = true;
                            }

                            this.posts = this.posts.concat(result);
                        }
                    })
                    .catch(err => {
                        /* eslint-disable no-console */
                        console.log(err);
                    });
            }
        },
        filterPosts: function(post) {
            return (
                post.title.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0
            );
        }
    },
    mounted: function() {
        this.fetchFacts();
        window.onscroll = () => {
            if (
                window.innerHeight + window.scrollY + 20 >=
                document.body.offsetHeight
            ) {
                this.fetchFacts();
            }
        };
    }
};
</script>