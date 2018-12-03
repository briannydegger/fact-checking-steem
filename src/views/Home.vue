<template>
    <div>
        <fact :id="100" :positive-vote="100" :negative-vote="200" :null-vote="100"></fact>
        <fact :id="0" :positive-vote="100" :negative-vote="100" :null-vote="100"></fact>
        <fact :id="1" :positive-vote="0" :negative-vote="100" :null-vote="0"></fact>
        <fact :id="2" :positive-vote="100" :negative-vote="100" :null-vote="0"></fact>
        <fact :id="3" :positive-vote="0" :negative-vote="100" :null-vote="100"></fact>
        <fact :id="4" :positive-vote="100" :negative-vote="0" :null-vote="100"></fact>
        <fact :id="5" :positive-vote="1000" :negative-vote="1000" :null-vote="100"></fact>
        <fact :id="6" :positive-vote="100" :negative-vote="100" :null-vote="1000"></fact>
        <fact :id="7" :positive-vote="100" :negative-vote="55555" :null-vote="1000"></fact>
        <fact :id="8" :positive-vote="100" :negative-vote="120" :null-vote="200"></fact>
        <fact :id="0" :positive-vote="100" :negative-vote="100" :null-vote="100"></fact>
        <fact :id="0" :positive-vote="1" :negative-vote="1000" :null-vote="100"></fact>
        <fact :id="0" :positive-vote="100" :negative-vote="100" :null-vote="100"></fact>
        <fact :id="0" :positive-vote="100" :negative-vote="100" :null-vote="100"></fact>
        <fact :id="0" :positive-vote="100" :negative-vote="5" :null-vote="100"></fact>
        <fact :id="0" :positive-vote="100" :negative-vote="100" :null-vote="100"></fact>
        <fact :id="0" :positive-vote="100" :negative-vote="100" :null-vote="100"></fact>
        <fact :id="0" :positive-vote="100" :negative-vote="100" :null-vote="100"></fact>
        <fact :id="0" :positive-vote="100" :negative-vote="100" :null-vote="100"></fact>
        <fact :id="0" :positive-vote="100" :negative-vote="100" :null-vote="201"></fact>
        <fact :id="0" :positive-vote="100" :negative-vote="100" :null-vote="201"></fact>
        <fact :id="0" :positive-vote="100" :negative-vote="100" :null-vote="201"></fact>
        <fact :id="0" :positive-vote="100" :negative-vote="100" :null-vote="201"></fact>
        <fact :id="0" :positive-vote="100" :negative-vote="100" :null-vote="201"></fact>
        <fact :id="0" :positive-vote="100" :negative-vote="100" :null-vote="201"></fact>
    </div>
</template>

<script>
import Fact from "../components/Fact.vue";

export default {
    name: "home",
    components: {
        Fact
    }
};
</script>