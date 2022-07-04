const modalComponent = {
    data() {
        return {
            header: "modal-component",
            img: {},
        };
    },
    props: ["selectedImg"],
    mounted() {
        console.log("modal component mounted");
        fetch(`/image_board/${this.selectedImg}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("DATAAA", data);
                this.img = data;
            })
            .catch((err) => {
                console.log("error is ", err);
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
            <h1>{{img.title}}</h1><br/>
            <p>Uploaded By: {{img.username}}</p><br/>
            <p>{{description}}</p>
        </div>
    </div>`,
};

export default modalComponent;
