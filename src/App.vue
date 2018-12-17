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
                        <md-icon class="md-primary" md-src="./assets/github.svg"/>
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

                    <div v-if="access_token" class="md-toolbar-section-end">
                        <md-button class="md-icon-button">
                            <router-link to="/add">
                                <md-icon>add</md-icon>
                            </router-link>
                            <md-tooltip>Add a fact</md-tooltip>
                        </md-button>
                        <md-avatar class="md-icon-button">
                            <img v-if="profile_image" :src="profile_image" alt="Avatar">
                            <md-icon v-else>person</md-icon>
                            <md-tooltip>{{ usernameDisplay }}</md-tooltip>
                        </md-avatar>
                        <md-button v-on:click="logOut()" class="md-raised">
                            <span>Logout</span>
                            <md-progress-bar md-mode="indeterminate" v-if="waitingLogout"></md-progress-bar>
                        </md-button>
                    </div>
                    <div v-else class="md-toolbar-section-end">
                        <a :href="link">
                            <md-button class="md-raised">Login</md-button>
                        </a>
                    </div>
                </div>
            </md-app-toolbar>
            <md-app-content>
                <router-view :access-token="access_token"></router-view>
            </md-app-content>
        </md-app>
    </div>
</template>

<script>
export default {
    name: "App",
    data: function() {
        let access_token = new URLSearchParams(document.location.search).get(
            "access_token"
        );

        if (access_token) {
            this.$apiSteemconnect.setAccessToken(access_token);
        }

        let username = new URLSearchParams(document.location.search).get(
            "username"
        );
        this.$user.setUsername(username);
        return {
            selectedSuggestion: null,
            suggestion: [],
            link: this.$apiSteemconnect.getLoginURL(),
            access_token: access_token,
            username: username,
            usernameDisplay: username,
            profile_image: "",
            waitingLogout: false
        };
    },
    watch: {
        username: function(username) {
            this.$user.setUsername(username);
        }
    },
    methods: {
        logOut: function() {
            this.waitingLogout = true;
            var that = this;
            this.$apiSteemconnect.revokeToken(function(err, res) {
                if (res && res.success) {
                    that.access_token = null;
                    document.location.href = "/";
                }
            });
            return false;
        }
    },
    mounted: function() {
        if (this.access_token) {
            let that = this;
            this.$apiSteemconnect.me(function(err, result) {
                if (!err) {
                    let json_metadata = JSON.parse(
                        result.account.json_metadata
                    );
                    that.usernameDisplay = json_metadata.profile.name;
                    that.profile_image = json_metadata.profile.profile_image;
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.search {
    max-width: 500px;
}
.md-drawer {
    width: 220px;
    max-width: calc(100vw - 125px);
}
</style>
