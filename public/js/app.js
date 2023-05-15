import * as Vue from "./vue.js";
import modalComponent from "./modal-component.js";

Vue.createApp({
    data() {
        return {
            name: "images",
            images: [],
            imgClicked: "",
            morePhotosButton: true,
            imageSelected: false,
            userInput: { username: "", description: "", title: "" },
            formNotValid: false,
            errorMsg: false,
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
            this.formNotValid = false;
            for (const prop in this.userInput) {
                if (
                    this.userInput[prop].length === 0 ||
                    this.imageSelected === false
                ) {
                    this.formNotValid = true;
                    return;
                } else {
                    setTimeout(() => {
                        this.userInput[prop] = "";
                    }, 1500);
                }
            }
            fetch("/upload", {
                method: "POST",
                body: new FormData(e.target),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    this.images.unshift(data.payload);
                })
                .catch((err) => {
                    console.log(err);
                    this.errorMsg = true;
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
                    this.errorMsg = true;
                });
        },
        clickedImg(id) {
            this.imgClicked = id;
        },
        closeModalComponent() {
            this.imgClicked = null;
        },
        checkIfUserSelectedImg() {
            const file = document.getElementById("choose_file");
            if (file.value.length > 0) {
                this.imageSelected = true;
            }
        },
    },
}).mount("#app_container");
