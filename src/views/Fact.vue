<template>
    <div>
        <md-card class="md-layout-item md-small-size-100">
            <md-card-area md-inset>
                <md-card-header>
                    <div class="md-title">{{ title }}</div>
                    <div class="md-subhead">
                        <md-icon>account_circle</md-icon>
                        <span>
                            <strong>
                                <a
                                    :href="'https://steemit.com/@' + author"
                                    target="_blank"
                                >{{ author }}</a>
                            </strong>
                        </span>
                        <md-icon>access_time</md-icon>
                        <span>{{ new Date(created).toLocaleString() }}</span>
                    </div>
                </md-card-header>

                <md-card-content v-html="content"></md-card-content>
            </md-card-area>

            <md-card-area md-inset>
                <md-card-content>
                    <div class="votes-line">
                        <voting-line
                            :author="$route.params.author"
                            :permlink="permlink"
                            :opinion="votes.opinions[$user.getUsername()]"
                            v-on:change="votingChange"
                        ></voting-line>
                        <vote-line :votes="votes"></vote-line>
                    </div>
                </md-card-content>
            </md-card-area>

            <md-card-content>
                <h3 class="md-subheading">Comments (testimonials and evidence)</h3>
                <div id="reply-content">
                    <md-button v-if="!reply" v-on:click="reply = true" class="md-raised">
                        <md-icon>edit</md-icon>Reply
                    </md-button>
                    <div v-else>
                        <form novalidate @submit.prevent="validateComment">
                            <editor
                                height="200px"
                                v-model="form.contentComment"
                                :validation-class="getValidationClass('contentComment')"
                                :disabled="sending"
                            />
                            <div class="progress-comment">
                                <md-progress-bar md-mode="indeterminate" v-if="sending"/>
                            </div>

                            <md-button
                                type="submit"
                                class="md-primary md-raised"
                                :disabled="sending"
                            >Send</md-button>
                            <md-button v-on:click="reply = false" class="md-raised">Cancel</md-button>
                        </form>
                    </div>
                </div>
                <comment
                    v-for="comment in comments"
                    v-bind:key="comment.id"
                    :pseudo="comment.author"
                    :date="comment.created"
                    :money="comment.total_payout_value"
                    :votes="$activeVotesToVotes(comment.active_votes)"
                    :replies="comment.replies"
                    :body="comment.body"
                    :permlink="comment.permlink"
                    :votesFact="votes"
                />
            </md-card-content>
        </md-card>
    </div>
</template>

<script>
import Comment from "../components/Comment";
import VoteLine from "../components/VoteLine";
import VotingLine from "../components/VotingLine";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import Editor from "../components/Editor";
import Promise from "bluebird";

export default {
    name: "fact",
    mixins: [validationMixin],
    components: {
        Comment,
        VoteLine,
        VotingLine,
        Editor
    },
    data: function() {
        return {
            reply: false,
            votes: this.$votesInit,
            title: "",
            created: "",
            content: "",
            form: {
                contentComment: ""
            },
            commentSaved: false,
            sending: false,
            comments: [],
            permlink: "",
            author: ""
        };
    },
    validations: {
        form: {
            contentComment: {
                required
            }
        }
    },
    methods: {
        getValidationClass(fieldName) {
            const field = this.$v.form[fieldName];

            if (field) {
                return {
                    "md-invalid": field.$invalid && field.$dirty
                };
            }
        },
        saveComment() {
            if (!this.$user.getUsername()) {
                alert("You have to be logged !");
                return false;
            }

            this.sending = true;
            let that = this;
            let permlinkComment = Math.random()
                .toString(36)
                .substring(2);

            this.$apiSteemconnect.comment(
                this.author,
                this.permlink,
                this.$user.getUsername(),
                permlinkComment,
                "",
                this.form.contentComment,
                "",
                function(err) {
                    if (err) {
                        alert(err.error_description);
                    } else {
                        that.commentSaved = true;
                        that.$v.$reset();
                        that.form.contentComment = "";
                        that.reply = false;

                        that.$dsteemClient.database
                            .call("get_content", [
                                that.$user.getUsername(),
                                permlinkComment
                            ])
                            .then(result => {
                                that.comments.push(result);
                            });
                    }
                    that.sending = false;
                }
            );
        },
        validateComment() {
            this.$v.$touch();

            if (!this.$v.$invalid) {
                this.saveComment();
            }
        },
        votingChange(newVotesState, newVote) {
            let that = this;
            this.votes.opinions[this.$user.getUsername()] = newVote;
            Object.keys(newVotesState).forEach(function(key) {
                that.votes[key] += newVotesState[key];
            });
        }
    },
    mounted: function() {
        let that = this;
        let fetchReplies = function(author, permlink) {
            return that.$dsteemClient.database
                .call("get_content_replies", [author, permlink])
                .then(replies => {
                    return Promise.map(replies, function(r) {
                        if (r.children > 0) {
                            return fetchReplies(r.author, r.permlink).then(
                                function(children) {
                                    r.replies = children;
                                    return r;
                                }
                            );
                        } else {
                            return r;
                        }
                    });
                });
        };

        let fetchInfos = function(
            comments,
            condenser_api_function,
            keyComment,
            keyResult
        ) {
            Promise.map(comments, function(comment) {
                that.$dsteemClient.database
                    .call(condenser_api_function, [
                        comment.author,
                        comment.permlink
                    ])
                    .then(result => {
                        if (keyResult) comment[keyComment] = result[keyResult];
                        else comment[keyComment] = result;
                        if (comment.replies.length > 0) {
                            fetchInfos(
                                comment.replies,
                                condenser_api_function,
                                keyComment,
                                keyResult
                            );
                        }
                    });
            });
        };

        this.$dsteemClient.database
            .call("get_content", [
                this.$route.params.author,
                this.$route.params.permlink
            ])
            .then(result => {
                this.content = this.$md.render(result.body);
                this.title = result.title;
                this.created = result.created;
                this.votes = this.$activeVotesToVotes(result.active_votes);
                this.permlink = result.permlink;
                this.author = result.author;
                fetchReplies(
                    this.$route.params.author,
                    this.$route.params.permlink
                ).then(function(comments) {
                    that.comments = comments;

                    fetchInfos(
                        that.comments,
                        "get_active_votes",
                        "active_votes"
                    );
                    fetchInfos(
                        that.comments,
                        "get_content",
                        "total_payout_value",
                        "total_payout_value"
                    );
                });
            });
    }
};
</script>

<style lang="scss" scoped>
.md-subhead span {
    padding-right: 10px;
}

.md-subhead .md-icon {
    margin-right: 3px;
}

#reply-content {
    margin-bottom: 15px;
}

.votes-line {
    height: 36px;
    line-height: 36px;
}

.votes-line span:first-of-type {
    margin-right: 10px;
}

.progress-comment {
    height: 5px;
}
</style>
