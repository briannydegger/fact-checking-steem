<template>
    <div class="comment">
        <md-avatar>
            <img v-if="imageLoaded && avatar != ''" :src="avatar" @error="imageLoaded = false;">
            <md-icon v-else>person</md-icon>
        </md-avatar>
        <div class="comment-line pseudo-line">
            <md-icon>account_circle</md-icon>
            <span class="span-padding-right">
                <strong>
                    <a :href="'https://steemit.com/@' + pseudo" target="_blank">{{ pseudo }}</a>
                </strong>
            </span>
            <md-icon>access_time</md-icon>
            <span class="span-padding-right">{{ new Date(date).toLocaleString() }}</span>
            <span class="span-padding-right">|</span>
            <span>His opinion : {{ opinionChar }}</span>
        </div>
        <div class="comment-line" v-html="this.$md.render(body)"></div>
        <span class="comment-line comment-votes-line">
            <md-icon>monetization_on</md-icon>
            <span class="span-padding-right">{{ money }}</span>
            <span class="span-padding-right">|</span>

            <voting-line
                :opinion="votes.opinions[$user.getUsername()]"
                :author="pseudo"
                :permlink="permlink"
                :nullVoteEnable="false"
            ></voting-line>
            <span class="span-padding-right"></span>
            <span class="span-padding-right">|</span>
            <vote-line :votes="votes" :nullVoteEnable="false"></vote-line>
            <span class="span-padding-right"></span>
            <span class="span-padding-right">|</span>
            <md-button v-on:click="reply = true" class="md-raised">
                <md-icon>edit</md-icon>Reply
            </md-button>
        </span>
        <div v-if="reply">
            <form novalidate @submit.prevent="validateComment">
                <editor
                    height="150px"
                    v-model="form.contentComment"
                    :validation-class="getValidationClass('contentComment')"
                    :disabled="sending"
                />
                <div class="progress-comment">
                    <md-progress-bar md-mode="indeterminate" v-if="sending"/>
                </div>

                <md-button type="submit" class="md-primary md-raised" :disabled="sending">Send</md-button>
                <md-button v-on:click="reply = false" class="md-raised">Cancel</md-button>
            </form>
        </div>
        <div class="replies">
            <comment
                v-for="comment in commentReplies"
                v-bind:key="comment.id"
                :pseudo="comment.author"
                :date="comment.created"
                :money="comment.pending_payout_value"
                :votes="$activeVotesToVotes(comment.active_votes)"
                :votesFact="votesFact"
                :replies="comment.replies"
                :body="comment.body"
                :permlink="comment.permlink"
            />
        </div>
    </div>
</template>

<script>
import VoteLine from "./VoteLine";
import VotingLine from "./VotingLine";
import Editor from "./Editor";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
    name: "Comment",
    mixins: [validationMixin],
    components: {
        VoteLine,
        VotingLine,
        Editor
    },
    props: {
        pseudo: String,
        date: String,
        money: String,
        votes: Object,
        votesFact: Object,
        replies: Array,
        body: String,
        permlink: String
    },
    data: function() {
        return {
            reply: false,
            form: {
                contentComment: ""
            },
            commentSaved: false,
            sending: false,
            avatar: "",
            imageLoaded: true,
            opinionChar: "-",
            commentReplies: this.replies
        };
    },
    watch: {
        replies: function() {
            this.commentReplies = this.replies;
        },
        votesFact: {
            handler(votesFact) {
                this.opinionChar = this.opinionToChar(
                    votesFact.opinions[this.pseudo]
                );
            },
            deep: true
        }
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
            this.sending = true;
            let that = this;
            let permlinkComment = Math.random()
                .toString(36)
                .substring(2);

            this.$apiSteemconnect.comment(
                this.pseudo,
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
                        that.$dsteemClient.database
                            .call("get_content", [
                                that.$user.getUsername(),
                                permlinkComment
                            ])
                            .then(result => {
                                that.commentSaved = true;
                                that.$v.$reset();
                                that.form.contentComment = "";
                                that.reply = false;

                                that.commentReplies.push(result);
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
        opinionToChar: opinion => {
            switch (opinion) {
                case 0: {
                    return "👎";
                }
                case 1: {
                    return "👍";
                }
                case 2: {
                    return "😐";
                }
                default: {
                    return "-";
                }
            }
        }
    },
    mounted: function() {
        let that = this;
        this.$dsteemClient.database
            .call("get_accounts", [[this.pseudo]])
            .then(result => {
                if (result[0]) {
                    that.imageLoaded = true;
                    that.avatar = JSON.parse(
                        result[0].json_metadata
                    ).profile.profile_image;
                }
            });
    }
};
</script>

<style lang="scss">
.comment {
    margin-top: 20px;
    min-height: 40px;
}

.comment .md-avatar {
    float: left;
    position: relative;
}

.comment-line {
    margin-left: 50px;
}

.comment .pseudo-line span {
    color: #788187;
}

.span-padding-right {
    padding-right: 10px;
}

.comment-votes-line {
    white-space: nowrap;
    height: 36px;
    line-height: 36px;
}

.comment-line .md-button {
    margin-top: 0px;
}

.replies {
    padding-left: 50px;
}

.comment .md-icon {
    margin-right: 3px;
}
</style>