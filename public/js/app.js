//CLIENT SIDE - TO LOOK IN THE BROWSER
//FOR SENDING DATA FROM SERVER TO CLIENT SIDE WE DO IT WITH JSON.
import * as Vue from "./vue.js";

Vue.createApp({
    data() {
        return {
            name: "",
            visible: true,
            images: [],
        };
    }, //DATA ENDS

    mounted() {
        //runs automaticly when vue reads our content
        //this is the location for us to ask if there are images to retrieve in the db

        fetch("/image_board")
            .then((resp) => resp.json())
            .then((fetchedData) => {
                console.log("response from /IMAGES: ", fetchedData);

                this.images = fetchedData; //asigning this.images "fetchedData"
            });
    },

    // methods: {
    //     //this is where we define all of our functions
    //     myFirstFunction: function (image) {
    //         console.log("my first function!!! the city name is ==> ", image);
    //     },
    // },
}).mount("#main_container");
