import commentsComponent from "./comments-component.js";

const modalComponent = {
    data() {
        return {
            header: "modal-component",
            img: {},
        };
    },
    props: ["selectedImg"],
    components: {
        "comments-component": commentsComponent,
    },
    mounted() {
        fetch(`/image_board/${this.selectedImg}`)
            .then((res) => res.json())
            .then((data) => {
                this.img = data;
            })
            .catch((err) => {
                console.log("ERROR: PROBLEM TO FETCH DATA: ", err);
            });
    },
    // watch: {
    //     selectedImg: function(smallerId, biggerId){
    //         if(/*condition*/){
    //             this.clickedImg = smallerId;
    //         }
    //         else if(/*condition*/) {
    //           this.clickedImg = biggerId;
    //         }
    //         else{
    //             this.clickedImg = /*current clicked image id*/
    //         }
    //     }
    // },
    methods: {
        close() {
            this.$emit("close");
            // Users will be able to type anything they want in a url so you should
            // probably handle the possibility that what is in the url is not a
            // valid image id. A simple way to do this is to have your component fire
            //  an event to close the modal if the network request to get the image data
            //   is not successful. In this situation, it is probably a good idea
            //   to use replaceState to change the url so that it is not possible to
            //   get back to the invalid url with the browser's history navigation buttons.
        },
    },
    template: `
    <div class="modal_wrapper_div">
        <div class="modal_component_div">
            <div class="span_x_div">
                <span @click="close" class=close-tag>x</span>
            </div>
            <div class="modal_img_div">
                <div class="next_previous_img_div">
                    <div class="previous_div">
                        <span><</span>
                    </div>
                    <div class="next_div">
                        <span>></span>
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
