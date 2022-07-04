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
    template: `<div class="modal container">
    <div class="image-modal">
        <img v-bind:src="image.url" v-bind:alt="image.title" v-bind:key="image.id"/>
        <h1>{{image.title}}</h1>
        <p>Uploaded by: {{image.user}}</p>
        <p>{{description}}</p>
    </div>
    <span @close="close"></span>
    </div>`,
    //MAKE SURE SPAN DOESN'T CAUSE ANY PROBLEMS
};

export default modalComponent;
