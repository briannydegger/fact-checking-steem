<template>
    <div class="page-container">
        <md-app md-waterfall md-mode="fixed-last">
            <md-app-drawer md-fixed md-permanent="card">
                <md-list>
                    <md-list-item>
                        <md-icon>home</md-icon>
                        <span class="md-list-item-text" v-on:click="menuVisible = false">
                            <router-link to="/">Home</router-link>
                        </span>
                    </md-list-item>

                    <md-list-item>
                        <md-icon>info</md-icon>
                        <span class="md-list-item-text" v-on:click="menuVisible = false">
                            <router-link to="/about">About</router-link>
                        </span>
                    </md-list-item>

                    <md-list-item>
                        <md-icon class="md-primary" md-src="../assets/github.svg"/>
                        <span class="md-list-item-text">
                            <a href="https://github.com/briannydegger/fact-checking-steem">GitHub</a>
                        </span>
                    </md-list-item>
                </md-list>
            </md-app-drawer>

            <md-app-toolbar class="md-dense md-primary">
                <div class="md-toolbar-row">
                    <div class="md-toolbar-section-start">
                        <router-link to="/">
                            <span class="md-title">Fact-checking Steem</span>
                        </router-link>
                    </div>

                    <form>
                        <md-autocomplete
                            class="search"
                            v-model="selectedSuggestion"
                            :md-options="suggestion"
                            md-layout="box"
                            required
                        >
                            <label>Search...</label>
                        </md-autocomplete>
                    </form>

                    <div class="md-toolbar-section-end">
                        <md-button class="md-icon-button">
                            <md-icon>add</md-icon>
                            <md-tooltip>Add a fact</md-tooltip>
                        </md-button>
                        <md-avatar class="md-icon-button">
                            <img
                                src="https://cdn.steemitimages.com/DQmSo5MRG365Q7avQTh14iUi8dbVp7ijfNiB2h88Rvzjrsy/10945712_1068431826500333_6455748346366888116_n.jpg"
                                alt="Avatar"
                            >
                            <md-tooltip>Brian</md-tooltip>
                        </md-avatar>
                        <md-button class="md-raised">Login</md-button>
                    </div>
                </div>
            </md-app-toolbar>

            <md-app-content>
                <router-view></router-view>
            </md-app-content>
        </md-app>
    </div>
</template>

<script>
export default {
    name: "App",
    data: () => ({
        selectedSuggestion: null,
        suggestion: []
    })
};
</script>

<style lang="scss" scoped>
.search {
    max-width: 500px;
}
.md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
}
</style>
