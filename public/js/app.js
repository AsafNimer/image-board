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
            morePhotosButton: true,
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
        handleImgSubmit(e) {
            e.preventDefault();
            console.log("HANDLED IMAGE SUBMIT");
            //the default i prevent is to redirect me to a new page /submit. i want to stay on my page "/"

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

        getMoreImages() {
            let smallestId = this.images[0].id;
            console.log("SMALLEST ID: ", smallestId);

            fetch(`/moreImages/${smallestId}`)
                .then((rsp) => rsp.json())
                .then((data) => {
                    console.log("DATA.PAYLOAD: ", data.payload);
                    this.images.unshift(data.payload); //I DON'T GET ANY DATA.PAYLOAD === []

                    const lowestImg = this.images[0];
                    console.log("lowestImg", lowestImg);

                    if (lowestImg.id === lowestImg.smallestId) {
                        console.log("lowestImg.id === lowestImg.smallestId");
                        console.log("lowestImg.id", lowestImg.id);
                        console.log(
                            "lowestImg.smallestId",
                            lowestImg.smallestId
                        );
                        this.morePhotosButton = null;
                    }
                })
                .catch((err) => {
                    console.log("ERROR WITH GET MORE PHOTOS: ", err);
                });
        },
        selectedImg(id) {
            console.log("ID OF THE CLICKED IMG: ", id);
            this.imgSelected = id;
        },
        closeModalComponent() {
            this.imgSelected = null;
        },
    },
}).mount("#main_container");
