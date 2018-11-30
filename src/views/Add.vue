<template>
    <div>
        <form novalidate class="md-layout" @submit.prevent="validateFact">
            <md-card class="md-layout-item md-size-50 md-small-size-100">
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

                    <md-field id="editor" :class="getValidationClass('content')">
                        <label>Content</label>
                        <md-textarea v-model="form.content" @input="update" :disabled="sending"></md-textarea>
                        <span class="md-helper-text">Markdown editor</span>
                        <span class="md-error">The content is required</span>
                        <div v-html="compiledMarkdown"></div>
                    </md-field>
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

export default {
    name: "FormValidation",
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
                this.lastFact = `${this.form.title} ${this.form.content}`;
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
        },
        // Markdown
        update: _.debounce(function(e) {
            this.form.content = e;
        }, 300)
    },
    // Markdown
    computed: {
        compiledMarkdown: function() {
            return marked(this.form.content, { sanitize: true });
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

// Markdown
#editor {
    height: 300px;
}

#editor div {
    word-wrap: break-word;
}

.md-textarea,
#editor div {
    display: inline-block;
    width: 49%;
    height: 100%;
    max-height: none;
    vertical-align: top;
    box-sizing: border-box;
    padding: 0 20px;
}

.md-textarea {
    border: none;
    resize: none !important;
    outline: none !important;
    font-size: 14px !important;
    padding: 0px 20px 20px 0px !important;
    margin-top: 20px;
    margin-left: 20px;
    height: calc(100% - 20px);
}

#editor div {
    border-left: 1px solid #ccc;
    margin-top: -16px !important;
    padding-top: 16px !important;
    height: 300px;
    overflow: auto;
}

code {
    color: #f66;
}
</style>