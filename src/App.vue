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
                            <md-tooltip
                                v-if="firstVisit"
                                md-direction="right"
                                md-active
                                id="new-here"
                            >New here ? You can read the user guide on the about page !</md-tooltip>
                        </span>
                    </md-list-item>

                    <md-list-item>
                        <md-icon class="md-primary" md-src="/github.svg"/>
                        <span class="md-list-item-text">
                            <a
                                target="_blank"
                                href="https://github.com/briannydegger/fact-checking-steem"
                            >GitHub</a>
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

                    <md-autocomplete
                        class="search"
                        v-model="filter"
                        :md-options="[]"
                        md-layout="box"
                    >
                        <label>Filter...</label>
                    </md-autocomplete>

                    <div v-if="access_token" class="md-toolbar-section-end">
                        <router-link to="/add">
                            <md-button class="md-icon-button">
                                <md-icon>add</md-icon>
                                <md-tooltip>Add a fact</md-tooltip>
                            </md-button>
                        </router-link>
                        <md-avatar class="md-icon-button">
                            <a
                                v-if="profile_image"
                                :href="'https://steemit.com/@' + username"
                                target="_blank"
                            >
                                <img :src="profile_image" alt="Avatar">
                            </a>
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
                <router-view :access-token="access_token" :filter="filter"></router-view>
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

        let firstVisit = false;
        if (!localStorage.noFirstVisit) {
            firstVisit = true;
            localStorage.noFirstVisit = "1";
        }
        return {
            filter: "",
            link: this.$apiSteemconnect.getLoginURL(),
            access_token: access_token,
            username: username,
            usernameDisplay: username,
            profile_image: "",
            waitingLogout: false,
            firstVisit: firstVisit
        };
    },
    watch: {
        username: function(username) {
            this.$user.setUsername(username);
        },
        filter: function() {
            if (this.$route.path != "/") {
                this.$router.push("/");
            }
        }
    },
    methods: {
        logOut: function() {
            this.waitingLogout = true;
            var that = this;
            this.$apiSteemconnect.revokeToken(function(err, res) {
                that.$user.setUsername("");
                that.access_token = null;
                document.location.href = "/";
            });
            return false;
        }
    },
    mounted: function() {
        if (this.access_token) {
            let that = this;
            this.$apiSteemconnect.me(function(err, result) {
                if (err) {
                    alert(
                        "An error occurred with your authentication. You should relogin."
                    );
                } else {
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

.md-app {
    min-height: 100vh;
}

#new-here {
    margin-left: -100px;
}
</style>
