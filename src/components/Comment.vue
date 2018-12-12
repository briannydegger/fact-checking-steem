<template>
    <div class="comment">
        <md-avatar>
            <img :src="avatar" alt="Avatar">
        </md-avatar>
        <div class="comment-line pseudo-line">
            <md-icon>account_circle</md-icon>
            <span class="span-padding-right">
                <strong>
                    <a :href="'https://steemit.com/@' + pseudo">{{ pseudo }}</a>
                </strong>
            </span>
            <md-icon>access_time</md-icon>
            <span class="span-padding-right">{{ date }}</span>
            <span class="span-padding-right">|</span>
            <span>Opinion : {{ opinionChar(opinion) }}</span>
        </div>
        <div class="comment-line" v-html="this.$md.render(body)"></div>
        <span class="comment-line comment-votes-line">
            <md-icon>monetization_on</md-icon>
            <span class="span-padding-right">{{ money }}</span>
            <span class="span-padding-right">|</span>

            <voting-line></voting-line>
            <span class="span-padding-right"></span>
            <span class="span-padding-right">|</span>
            <vote-line :votes="this.$activeVotesToVotes(active_votes)"></vote-line>
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
                v-for="comment in replies"
                v-bind:key="comment.id"
                :pseudo="comment.author"
                avatar="test"
                :date="comment.created"
                :money="comment.pending_payout_value"
                :active_votes="comment.active_votes"
                :opinion="-1"
                :replies="comment.replies"
                :body="comment.body"
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
import Remarkable from "remarkable";

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
        avatar: String,
        date: String,
        money: String,
        active_votes: Array,
        opinion: Number,
        replies: Array,
        body: String
    },
    data: function() {
        return {
            reply: false,
            form: {
                contentComment: ""
            },
            commentSaved: false,
            sending: false,
            opinionChar: opinion => {
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
            this.sending = true;

            // Instead of this timeout, here you can call your API
            window.setTimeout(() => {
                this.commentSaved = true;
                this.sending = false;
                this.$v.$reset();
                this.form.contentComment = "";
            }, 1500);
        },
        validateComment() {
            this.$v.$touch();

            if (!this.$v.$invalid) {
                this.saveComment();
            }
        }
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
</style>