import * as Vue from "./vue.js";
import modalComponent from "./modal-component.js";

Vue.createApp({
    data() {
        return {
            name: "images",
            images: [],
            imgClicked: "",
            imagePath: "",
            moreButton: true,
            imageSelected: false,
            userInput: { username: "", description: "", title: "" },
            formNotValid: false,
            errorMsg: false,
            // notification: false,
            // notifications: [],
        };
    },
    mounted() {
        history.pushState({}, "", "/home");
        this.imagePath = "";
        this.imageRemoved = false;

        fetch("/image_board")
            .then((res) => res.json())
            .then((data) => {
                this.images = data;
                console.log("fetched-data: ", data);
            });

        // this.sendNotifications();

        window.addEventListener("popstate", () => {
            let path = location.pathname.slice(1);
            if (path != "") {
                path = Number.parseInt(path);
                if (Number.isNaN(path)) {
                    history.replaceState({}, "", "/");
                } else {
                    this.idCard = path;
                }
            } else {
                this.imgClicked = "";
            }
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
            let lowestIdOnScreen = this.images[this.images.length - 1].id;
            fetch(`/moreImages/${lowestIdOnScreen}`)
                .then((res) => res.json())
                .then((data) => {
                    this.images = [...this.images, ...data.payload];

                    const lastImg = this.images[this.images.length - 1];
                    //"lowestId" (line 96) is a prop on the data.payload[data.payload.length - 1] obj
                    //which represents the last image in the last batch that retrieved with 'more' button.
                    //"lowestId" originates in my query on db.js (line 49)
                    // NOTE: lastImg.lowestId works as well
                    if (
                        lastImg.id ===
                        data.payload[data.payload.length - 1].lowestId
                    ) {
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
                this.imagePath = file.value;
            }
        },
        updateImg(newRenderedImgId) {
            this.imgClicked = newRenderedImgId;
            history.pushState({}, "", `/${this.imgClicked}`);
        },
        // sendNotifications() {
        //     console.log("notifications was mounted");
        //     setInterval(() => {
        //     fetch("/image_board")
        //         .then((res) => res.json())
        //         .then((data) => {
        //             console.log("this.images[0].id: ", this.images[0].id);

        //             console.log("data: ", data[0].id);
        //         })
        //         .catch((err) => {
        //             console.log(err);
        //         });
        //     }, 5000);
        // },
        removeImg(imgId) {
            // console.log("imageID: ", imgId);
            // console.log("this.images before filter: ", this.images);
            const filterResults = this.images.filter((img) => img.id != imgId);
            console.log("this.images after filter: ", filterResults);
            this.images = filterResults;
        },
    },
}).mount("#app_container");
