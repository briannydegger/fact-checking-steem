<template>
    <md-field class="editor" :style="heightContainer" :class="validationClass">
        <label>Content</label>
        <md-textarea v-model="content" @input="update" :disabled="disabled"></md-textarea>
        <span class="md-helper-text">Markdown editor</span>
        <span class="md-error">The content is required</span>
        <div v-html="compiledMarkdown"></div>
    </md-field>
</template>

<script>
import _ from "lodash";
import marked from "marked";

export default {
    name: "Editor",
    components: {},
    props: {
        value: {
            type: String,
            default: ""
        },
        height: {
            type: String,
            default: "300px"
        },
        validationClass: Object,
        disabled: Boolean
    },
    methods: {
        update: _.debounce(function(e) {
            this.content = e;
        }, 300)
    },
    computed: {
        heightContainer() {
            return "height: " + this.height;
        },
        content: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit("input", value);
            }
        },
        compiledMarkdown: function() {
            return marked(this.content, { sanitize: true });
        }
    }
};
</script>

<style lang="scss" scoped>
.editor div {
    word-wrap: break-word;
}

.md-textarea,
.editor div {
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

.editor div {
    border-left: 1px solid #ccc;
    margin-top: -16px !important;
    padding-top: 16px !important;
    height: calc(100% + 16px);
    overflow: auto;
}

code {
    color: #f66;
}
</style>