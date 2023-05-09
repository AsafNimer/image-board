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
        fetch(`/image_board/${this.selectedImg}`)
            .then((res) => res.json())
            .then((data) => {
                this.img = data;
            })
            .catch((err) => {
                console.log("ERROR: PROBLEM TO FETCH DATA: ", err);
            });
    },
    methods: {
        close() {
            this.$emit("close");
        },
    },
    template: `
    <div class="modal_wrapper_div">
        <div class="modal_component_div">
            <div class="span_x_div">
                <span @click="close" class=close-tag>x</span>
            </div>
            <div class="modal_img_div">
                <img v-bind:src="img.url" v-bind:alt="img.title" v-bind:key="img.id"/><br/>
            </div>
            <div class="user_details_div">
                <h1>{{img.title}}</h1>
                <p class="uploaded_by_par">Uploaded By:<br>{{img.username}}</p><br>
                <p class="decription_par">Description:<br>{{img.description}}</p>
                <comments-component v-bind:img-id="selectedImg"></comments-component>
            </div>
        </div>
    </div>`,
};

export default modalComponent;
