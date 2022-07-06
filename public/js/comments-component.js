const commentsComponent = {
    data() {
        return {
            comments: [],
            username: "",
            comment: "",
        };
    },
    props: ["imgId"],
    mounted() {
        console.log("comments component mounted");
        console.log("comments.js this.imgId", this.imgId);

        fetch(`/comments/${this.imgId}`)
            .then((res) => res.json())
            .then((fetchedData) => {
                console.log("FETCHED DATA", fetchedData);
                this.comments = fetchedData;
            })
            .catch((err) => {
                console.log("ERROR: PROBLEM TO FETCH DATA ", err);
            });
    },
    methods: {
        handleCommentSubmit(e) {
            e.preventDefault();
            console.log("HANDLED COMMENT SUBMIT");

            fetch("/comment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    comment: this.comment,
                    username: this.username,
                    image_id: this.imgId,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    this.comments.unshift(data.payload);
                });
        },
    },
    template: `<div class="comments_container">
    <div class="comment_box" v-if="comments.length" v-for="comment in comments" :key="comment.id">
        <ul>
            <li>
                <p><strong>{{comment.username}}:</strong></p>
                <p>{{comment.comment}}</p>
            </li>
        </ul>
    </div>
         <form>
            <input v-model='username' type="text" name="username" placeholder="user"><br>
            <input v-model='comment' id="commentbox" type="text" name="comment" placeholder="Add Comment..."><br>
            <button @click="handleCommentSubmit">Add Comment</button>
        </form>
    </div>`,
};

export default commentsComponent;
