import * as Vue from "./vue.js";
import modalComponent from "./modal-component.js";

Vue.createApp({
    data() {
        return {
            name: "images",
            images: [],
            imgSelected: "",
            morePhotosButton: true,
            // addClass: { modal_for_mobile: this.imgSelected },
        };
    },
    mounted() {
        fetch("/image_board")
            .then((res) => res.json())
            .then((fetchedData) => {
                console.log("response from /IMAGES: ", fetchedData);
                this.images = fetchedData;
            });
    },
    components: {
        "modal-component": modalComponent,
    },
    methods: {
        handleImgSubmit(e) {
            e.preventDefault();
            //the default i prevent is to redirect me to a new page/submit.
            // I want to stay on my page "/"
            fetch("/upload", {
                method: "POST",
                body: new FormData(e.target),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    this.images.unshift(data.payload);
                    const userInput =
                        document.getElementsByClassName("upload_input");
                    for (let i = 0; i < userInput.length; i++) {
                        userInput[i].value = "";
                    }
                });
        },
        getMoreImages() {
            let smallestId = this.images[0].id;
            console.log("SMALLEST ID: ", smallestId);

            fetch(`/moreImages/${smallestId}`)
                .then((rsp) => rsp.json())
                .then((data) => {
                    console.log("DATA.PAYLOAD: ", data.payload);
                    this.images.unshift(data.payload);

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
            this.imgSelected = id;
        },
        closeModalComponent() {
            this.imgSelected = null;
        },
    },
}).mount("#app_container");
