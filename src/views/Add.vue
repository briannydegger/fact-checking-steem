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

            <md-snackbar :md-active.sync="factSaved">The fact {{ lastFact }} was saved with success!</md-snackbar>
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
        accessToken: String,
        api: Object
    },
    mixins: [validationMixin],
    data: () => ({
        form: {
            title: null,
            content: ""
        },
        factSaved: false,
        sending: false,
        lastFact: null
    }),
    validations: {
        form: {
            title: {
                required
            },
            content: {
                required
                //minLength: minLength(3)
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

            // Instead of this timeout, here you can call your API
            window.setTimeout(() => {
                this.lastFact = `${this.form.title}`;
                this.factSaved = true;
                this.sending = false;
                this.clearForm();
            }, 1500);
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