import commentsComponent from "./comments-component.js";

const modalComponent = {
    data() {
        return {
            header: "modal-component",
            img: {},
            rendernNextBtn: true,
            renderPreviousBtn: true,
            nextImgOnScreen: null,
            previousImgOnScreen: null,
        };
    },
    props: ["selectedImg"],
    components: {
        "comments-component": commentsComponent,
    },
    mounted() {
        this.fetchData();
    },
    watch: {
        selectedImg: function () {
            this.fetchData();
            this.img.id = this.img.nextId || this.img.previousId;
        },
    },
    methods: {
        fetchData() {
            console.log("this.selectedImg: ", this.selectedImg);
            this.rendernNextBtn = true;
            this.renderPreviousBtn = true;

            fetch(`/image_board/${this.selectedImg}`)
                .then((res) => res.json())
                .then((data) => {
                    this.img = data;
                    if (this.img.previousId === null) {
                        this.renderPreviousBtn = false;
                    }
                    if (this.img.nextId === null) {
                        this.rendernNextBtn = false;
                    }
                })
                .catch((err) => {
                    console.log("error: problem fetching data: ", err);
                });
        },
        close() {
            this.$emit("close");
        },
        nextImgId() {
            //this fired when i click on prev/nxt arrows
            console.log(this.img.nextId);
            this.$emit("update", this.img.nextId);
        },
        previousImgId() {
            //this fired when i click on prev/nxt arrows
            console.log(this.img.previousId);
            this.$emit("update", this.img.previousId);
        },
    },

    template: `
    <div @click="close" class="modal_wrapper_div">
        <div class="modal_component_div">
            <div class="span_x_div">
                <span @click="close" class=close-tag>x</span>
            </div>
            <div class="modal_img_div">
                <div class="next_previous_img_div">
                    <div v-if="renderPreviousBtn" @click="previousImgId" class="previous_div">
                        <span>«</span>
                    </div>
                    <div v-if="rendernNextBtn" @click="nextImgId" class="next_div">
                        <span>»</span>
                    </div>
                </div>
                <img v-bind:src="img.url" v-bind:alt="img.title" v-bind:key="img.id"/><br/>
            </div>
            <div class="user_details_div">
                <h1>{{img.title}}</h1>
                <div class="upload_details_div">
                   <p class="uploaded_by_par">Uploaded By:<br>{{img.username}}</p><br>
                    <p class="decription_par">Description:<br>{{img.description}}</p>
                </div>
                <comments-component v-bind:img-id="selectedImg"></comments-component>
            </div>
        </div>
    </div>`,
};

export default modalComponent;
