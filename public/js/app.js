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
            isMobile: false,
        };
    },
    mounted() {
        console.log(window.innerWidth);
        history.pushState({}, "", "/home");
        this.imagePath = "";
        this.imageRemoved = false;

        fetch("/image_board")
            .then((res) => res.json())
            .then((data) => {
                this.images = data;
                console.log("fetched-data: ", data);
            });

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
                        this.imageSelected = false;
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

            if (window.innerWidth <= 768) {
                this.isMobile = true;
            }
        },
        closeModalComponent() {
            this.imgClicked = null;
            this.isMobile = false;
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
        removeImg(imgId) {
            const filterResults = this.images.filter((img) => img.id != imgId);
            console.log("this.images after filter: ", filterResults);

            fetch(`/removeImgAndComments/${imgId}`, {
                method: "DELETE",
                header: { "Content-type": "aplication/json" },
            })
                .then((res) => {
                    if (res.ok) {
                        console.log(`Img ${imgId} and its comments removed`);
                        this.images = filterResults;
                    } else {
                        console.log("sth went wrong");
                    }
                })
                .catch((err) => {
                    console.log("Fetch went wrong: ", err);
                });
        },
    },
}).mount("#app_container");
