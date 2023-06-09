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
        this.fetchData();
        console.log("mounted comments", this.imgId);
    },
    watch: {
        imgId: function () {
            this.fetchData();
        },
    },
    methods: {
        fetchData() {
            fetch(`/comments/${this.imgId}`)
                .then((res) => res.json())
                .then((fetchedData) => {
                    console.log(
                        "FETCHED DATA: comments are retreived",
                        fetchedData
                    );
                    this.comments = fetchedData;
                })
                .catch((err) => {
                    console.log("ERROR: PROBLEM TO FETCH DATA ", err);
                });
        },
        handleCommentSubmit(e) {
            e.preventDefault();

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
                    this.comments.unshift(data.payload);
                    this.username = "";
                    this.comment = "";
                })
                .catch((err) => {
                    "Error fetch comments: ", err;
                });
        },
    },
    template: `
    <div class="comments_component_div">    
        <div class="comments_form_div">
            <form class="comments_form">
                <input class="username_input" v-model='username' type="text" name="username" placeholder="User Name">
                <textarea class="comment_input" v-model='comment' id="commentbox" type="text" name="comment" placeholder="Add Your Comment..." cols="30" rows="10"></textarea>
                <button class="comments_button" @click="handleCommentSubmit">Add Comment</button>
            </form>
        </div>
        <div class="single_comment_box" v-if="comments.length" v-for="comment in comments" :key="comment.id">
            <div class="list_item">
                <p id="username_par">{{comment.username}}:</p>
                <p id="comment_par">{{comment.comment}}</p>
            </div>
        </div>
    </div>`,
};

export default commentsComponent;
