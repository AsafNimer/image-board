const modalComponent = {
    data() {
        return {
            heading: "modal component",
        };
    },
    // props[],
    mounted() {
        console.log("modal component mounted");
    },
    // methods: {
    //     increaseCount() {
    //         console.log("user wants to up count");
    //         this.count++;
    //     },
    // },
    // template: `<div>
    // <h1>I am your {{heading}}</h1>
    // <h2>count is: {{count}}</h2>
    // <button @click="count--">decrease count</button>
    // </div>`,
};

export default modalComponent;
