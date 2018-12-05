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
        <div class="comment-line">
            <p>
                <a href="/@berniesanders">@berniesanders</a> - Can you elaborate on that? Who are the criminals and scammers? For me, it seems like Whaleshares was created due to there being a disagreement between their devs and steemit devs like a hard fork?
            </p>
            <p>There are no bots on the platform which is good but I don't think the issue of manipulating the trending feed will ever go away - seen people with 3 upvotes make it to the top of the feed and this "summon a whale" thing doesn't seem to be any different to buying upvotes.</p>
            <p>But I like to use a platform first before writing about them so if you have any more information on it, would be great to hear 🙂</p>
            <p>
                Posted using
                <a href="https://steemit.com/@partiko-android">Partiko Android</a>
            </p>
        </div>
        <span class="comment-line comment-votes-line">
            <md-icon>monetization_on</md-icon>
            <span class="span-padding-right">{{ money }}</span>
            <span class="span-padding-right">|</span>

            <voting-line></voting-line>
            <span class="span-padding-right"></span>
            <span class="span-padding-right">|</span>
            <vote-line
                :positiveVote="positiveVote"
                :negativeVote="negativeVote"
                :nullVote="nullVote"
            ></vote-line>
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
                :pseudo="comment.pseudo"
                :avatar="comment.avatar"
                :date="comment.date"
                :money="comment.money"
                :positiveVote="comment.positiveVote"
                :negativeVote="comment.negativeVote"
                :nullVote="comment.nullVote"
                :opinion="comment.opinion"
                :replies="comment.replies"
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
    data: () => ({
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
    }),
    props: {
        pseudo: String,
        avatar: String,
        date: String,
        money: Number,
        positiveVote: Number,
        negativeVote: Number,
        nullVote: Number,
        opinion: Number,
        replies: Array
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