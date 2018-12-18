<template>
    <div>
        <form novalidate class="md-layout" @submit.prevent="validateFact">
            <md-card class="md-layout-item md-small-size-100">
                <md-card-header>
                    <div class="md-title">Fact</div>
                </md-card-header>

                <md-card-content>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('title')">
                                <label for="title">Title</label>
                                <md-input
                                    name="title"
                                    id="title"
                                    v-model="form.title"
                                    :disabled="sending"
                                />
                                <span
                                    class="md-error"
                                    v-if="!$v.form.title.required"
                                >The title is required</span>
                            </md-field>
                        </div>
                    </div>

                    <editor
                        v-model="form.content"
                        :validation-class="getValidationClass('content')"
                        :disabled="sending"
                    />
                </md-card-content>

                <md-progress-bar md-mode="indeterminate" v-if="sending"/>

                <md-card-actions>
                    <md-button type="submit" class="md-primary" :disabled="sending">Submit fact</md-button>
                </md-card-actions>
            </md-card>

            <md-snackbar :md-active="factSaved">
                <span>The fact
                    <router-link
                        :to="'/fact/' + $user.getUsername() + '/' + permlink"
                    >{{ lastFact }}</router-link>&nbsp;was saved with success!
                </span>
            </md-snackbar>
        </form>
    </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import Editor from "../components/Editor";

export default {
    name: "FormValidation",
    components: {
        Editor
    },
    props: {
        accessToken: String
    },
    mixins: [validationMixin],
    data: () => ({
        form: {
            title: "",
            content: ""
        },
        factSaved: false,
        sending: false,
        lastFact: null,
        permlink: ""
    }),
    validations: {
        form: {
            title: {
                required
            },
            content: {
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
        clearForm() {
            this.$v.$reset();
            this.form.title = null;
            this.form.content = "";
        },
        saveFact() {
            this.sending = true;
            this.permlink = this.form.title
                .toLowerCase()
                .replace(/[^A-Za-z0-9]+/g, "-");

            let that = this;
            this.$apiSteemconnect.broadcast(
                [
                    [
                        "comment",
                        {
                            author: this.$user.getUsername(),
                            body: this.form.content,
                            json_metadata: JSON.stringify({
                                tags: ["fact-checking-app"],
                                app: "fact-checking"
                            }),
                            parent_author: "",
                            parent_permlink: "fact-checking-app",
                            permlink: this.permlink,
                            title: this.form.title
                        }
                    ],
                    [
                        "comment_options",
                        {
                            allow_curation_rewards: true,
                            allow_votes: true,
                            author: this.$user.getUsername(),
                            max_accepted_payout: "0.000 SBD",
                            percent_steem_dollars: 10000,
                            permlink: this.permlink,
                            extensions: [
                                [
                                    0,
                                    {
                                        beneficiaries: [
                                            { account: "null", weight: 1 }
                                        ]
                                    }
                                ]
                            ]
                        }
                    ]
                ],
                function(err) {
                    if (err) {
                        alert(err.error_description);
                    } else {
                        that.lastFact = `${that.form.title}`;
                        that.factSaved = true;
                        that.clearForm();
                    }
                    that.sending = false;
                }
            );
        },
        validateFact() {
            this.$v.$touch();

            if (!this.$v.$invalid) {
                this.saveFact();
            }
        }
    },
    mounted: function() {
        if (!this.accessToken) {
            this.$router.push("/");
        }
    }
};
</script>

<style lang="scss" scoped>
.md-progress-bar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
}
</style>