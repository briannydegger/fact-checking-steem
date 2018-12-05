<template>
    <div>
        <md-card class="md-layout-item md-small-size-100">
            <md-card-area md-inset>
                <md-card-header>
                    <div class="md-title">Fact title {{ $route.params.id }}</div>
                    <div class="md-subhead">
                        <md-icon>account_circle</md-icon>
                        <span>
                            <strong>
                                <a href="https://steemit.com/@irtiss">Irtiss</a>
                            </strong>
                        </span>
                        <md-icon>access_time</md-icon>
                        <span>5:30PM</span>
                    </div>
                </md-card-header>

                <md-card-content>content.</md-card-content>
            </md-card-area>

            <md-card-area md-inset>
                <md-card-content>
                    <div class="votes-line">
                        <voting-line></voting-line>
                        <vote-line
                            :positiveVote="positiveVote"
                            :negativeVote="negativeVote"
                            :nullVote="nullVote"
                        ></vote-line>
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

export default {
    name: "fact",
    mixins: [validationMixin],
    components: {
        Comment,
        VoteLine,
        VotingLine,
        Editor
    },
    data: () => ({
        reply: false,
        positiveVote: 321,
        negativeVote: 123,
        nullVote: 123123,
        form: {
            contentComment: ""
        },
        commentSaved: false,
        sending: false,
        comments: [
            {
                id: 1,
                pseudo: "Pseudo",
                avatar:
                    "https://cdn.steemitimages.com/DQmSo5MRG365Q7avQTh14iUi8dbVp7ijfNiB2h88Rvzjrsy/10945712_1068431826500333_6455748346366888116_n.jpg",
                date: "01-01-2018",
                money: 32,
                positiveVote: 321,
                negativeVote: 321,
                nullVote: 3,
                opinion: 1,
                replies: [
                    {
                        id: 1,
                        pseudo: "Pseudo",
                        avatar:
                            "https://cdn.steemitimages.com/DQmSo5MRG365Q7avQTh14iUi8dbVp7ijfNiB2h88Rvzjrsy/10945712_1068431826500333_6455748346366888116_n.jpg",
                        date: "01-01-2018",
                        money: 32,
                        positiveVote: 321,
                        negativeVote: 321,
                        nullVote: 3,
                        opinion: -1,
                        replies: [
                            {
                                id: 1,
                                pseudo: "Pseudo",
                                avatar:
                                    "https://cdn.steemitimages.com/DQmSo5MRG365Q7avQTh14iUi8dbVp7ijfNiB2h88Rvzjrsy/10945712_1068431826500333_6455748346366888116_n.jpg",
                                date: "01-01-2018",
                                money: 32,
                                positiveVote: 321,
                                negativeVote: 321,
                                nullVote: 3,
                                opinion: 2,
                                replies: []
                            }
                        ]
                    },
                    {
                        id: 1,
                        pseudo: "Pseudo",
                        avatar:
                            "https://cdn.steemitimages.com/DQmSo5MRG365Q7avQTh14iUi8dbVp7ijfNiB2h88Rvzjrsy/10945712_1068431826500333_6455748346366888116_n.jpg",
                        date: "01-01-2018",
                        money: 32,
                        positiveVote: 321,
                        negativeVote: 321,
                        nullVote: 3,
                        opinion: 0,
                        replies: []
                    }
                ]
            }
        ]
    }),
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

<style lang="scss" scoped>
.md-subhead span {
    padding-right: 10px;
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
