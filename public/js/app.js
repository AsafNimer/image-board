import * as Vue from "./vue.js";
import modalComponent from "./modal-component.js";

Vue.createApp({
    data() {
        return {
            name: "images",
            images: [],
            imgClicked: "",
            moreButton: true,
            imageSelected: false,
            userInput: { username: "", description: "", title: "" },
            formNotValid: false,
            errorMsg: false,
        };
    },
    mounted() {
        window.addEventListener("popstate", (e) => {
            console.log(location.pathname, e.state);
            // You will also want to open and close the modal appropriately when the user
            // uses the browser's history navigation buttons to move forward or back in the history.
            //  To detect that this is happening, you should start listening for the popstate
            //   event when you initialize your app. In the event handler you can set the
            //   reactive property you are using to keep track of the id of the image
            //   displayed in the modal to the correct value for the new url.

            // show whatever is appropriate for the new url
            // if you need it, e.state has the data you passed to `pushState`
        });
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
            let smallestId = this.images[this.images.length - 1].id;
            console.log("SMALLEST ID: ", smallestId);

            fetch(`/moreImages/${smallestId}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log("DATA.PAYLOAD: ", data.payload);
                    this.images.push(data.payload);

                    const lowestImg = this.images[this.images.length - 1];
                    console.log("lowestImg", lowestImg);

                    if (lowestImg.id === lowestImg.smallestId) {
                        this.moreButton = false;
                    }
                })
                .catch((err) => {
                    console.log("ERROR WITH GET MORE PHOTOS: ", err);
                    this.errorMsg = true;
                });
        },
        clickedImg(id) {
            this.imgClicked = id;
            history.pushState(
                {},
                "",
                `${location.pathname}/${this.imgClicked}`
            );
        },
        closeModalComponent() {
            this.imgClicked = null;
            history.pushState({}, "", "/home");
        },
        checkIfUserSelectedImg() {
            const file = document.getElementById("choose_file");
            if (file.value.length > 0) {
                this.imageSelected = true;
            }
        },
    },
}).mount("#app_container");
