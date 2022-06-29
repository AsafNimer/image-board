//SERVER SIDE
const express = require("express");
const app = express();
const db = require("./db");
console.log(db);

app.use(express.static("./public"));

app.use(express.json());

app.get("/image_board", (req, res) => {
    db.getImages()
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("ERROR IN GET IMAGES", err);
        });
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));
