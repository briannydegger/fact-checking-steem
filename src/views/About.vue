<template>
    <div>
        <p>Fact-cheking Steem is a website using the wisdom of the crowd and the Steem blockchain to try to detect fake facts.</p>
        <p>Users can post any fact / article and let others comment and vote to say if they think it's true or false. The blockchain steem rewards users bringing relevant comments and those who vote in the direction of the popular opinion.</p>
        <p>
            This project was made by
            <a href="https://steemit.com/@irtiss" target="_blank">Brian</a> during is thesis of Master of Science HES-SO in Engineering.
        </p>
        <p>
            Read more about :
            <a href="https://steem.com/" target="_blank">steem</a> or
            <a href="https://steemit.com/faq.html" target="_blank">steemit</a>.
        </p>
        <h3>User guide</h3>
        <p>
            To interact with this app, that's mean post facts, vote facts and comment facts, you need a Steem account. You can claim an account
            <a
                href="https://signup.steemit.com/"
                target="_blank"
            >here</a>.
        </p>

        <p>Once connected, you can add a fact with the plus on the top-right screen. A fact need a title and a content :</p>
        <img alt="add" src="about/add.png">
        <p>Then, you can go directly to the fact or access it on the home page :</p>
        <img alt="fact" src="about/fact.png">

        <p>That's here where crowd involved. You can give your opinion indicating if you think that this fact is true, false, or details or additional information missing.
            <br>You can see popular opinion with the total of votes :
        </p>
        <ul>
            <li>
                The majority thinks it's true :
                <img
                    alt="positive curating"
                    src="about/curatingPositive.png"
                >
            </li>
            <li>
                The majority thinks it's false :
                <img
                    alt="negative curating"
                    src="about/curatingNegative.png"
                >
            </li>
            <li>
                The majority thinks it's missing information :
                <img
                    alt="null curating"
                    src="about/curatingNull.png"
                >
            </li>
        </ul>

        <p>To finish, you can also comment to discuss about your opinion and bring proofs. Vote for relevant comments to reward users who bring pertinent testimonials :</p>
        <img alt="comments" src="about/comments.png">
    </div>
</template>

<script>
export default {
    name: "about",
    components: {}
};
</script>

<style lang="scss" scoped>
img {
    width: 960px;
}

li img {
    width: 720px;
}
</style>
