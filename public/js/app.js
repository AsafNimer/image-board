//CLIENT SIDE - TO LOOK IN THE BROWSER
//FOR SENDING DATA FROM SERVER TO CLIENT SIDE WE DO IT WITH JSON.
import * as Vue from "./vue.js";
//importing our components from their files reuires us to use the file extension. (.js)
import modalComponent from "./modal-component.js";

Vue.createApp({
    data() {
        return {
            name: "images",
            images: [],
            imgSelected: "",
        };
    },
    mounted() {
        //runs automaticly when vue reads our content
        //this is the location for us to ask if there are images to retrieve in the db
        fetch("/image_board") //talks to the server. mounted runs right away. and then server responds that yes it has /images.
            .then((res) => res.json())
            .then((fetchedData) => {
                console.log("response from /IMAGES: ", fetchedData);

                this.images = fetchedData; //asigning this.images "fetchedData"
            });
    },
    components: {
        "modal-component": modalComponent,
    },
    methods: {
        handleSubmit(e) {
            e.preventDefault();
            console.log("HANDLED SUBMIT"); //the default i prevent is to redirect me to a new page /submit. i want to stay on my page "/"

            fetch("/upload", {
                method: "POST",
                body: new FormData(e.target),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    this.images.unshift(data.payload);
                });
        },
        selectImg(id) {
            console.log("ID OF CLICKED IMG: ", id);
            this.imgSelected = id;
        },
        closeModalComponent() {
            this.imgSelected = null;
        },
    },
}).mount("#main_container");
