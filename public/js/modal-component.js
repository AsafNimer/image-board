import commentsComponent from "./comments-component.js";

const modalComponent = {
    data() {
        return {
            header: "modal-component",
            img: {},
        };
    },
    props: ["selectedImg"],
    components: {
        "comments-component": commentsComponent,
    },
    mounted() {
        console.log("modal component mounted");
        fetch(`/image_board/${this.selectedImg}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("FETCHED DATA", data);
                this.img = data;
            })
            .catch((err) => {
                console.log("ERROR: PROBLEM TO FETCH DATA ", err);
            });
    },
    methods: {
        close() {
            this.$emit("close");
        },
    },
    template: `<div class="modal_container">
        <span @click="close" class=close-tag>x</span>
        <div class="image-modal">
            <img v-bind:src="img.url" v-bind:alt="img.title" v-bind:key="img.id"/><br/>
        </div>
        <div class="user_details">
            <h1>{{img.title}}</h1><br/>
            <h4>Uploaded By: {{img.username}}</h4><br/>
            <p>Description: {{img.description}}</p>
        </div>
         <comments-component v-bind:img-id="selectedImg" ></comments-component>
    </div>`,
};

export default modalComponent;
