const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");

console.log("NEW IMAGEBOARD");

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, "uploads");
    },
    filename(req, file, callback) {
        uidSafe(24).then((randomString) => {
            //keepS the original file extension
            console.log("file: ", file);
            const extname = path.extname(file.originalname);
            console.log("EXTNAME: ", extname);
            callback(null, `${randomString}${extname}`);
        });
    },
});

const uploader = multer({
    //proccess out img data we're getting
    storage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(express.urlencoded({ extended: false })); // GIVES US AN ACCESS TO OUR FORM DATA, WITHOUT, MIDDLEWARE EXPRESS CAN'T INTERPRET IT

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

app.get("/image_board/:image", (req, res) => {
    db.getSingleImg(req.params.image).then((result) => {
        res.json(result.rows[0]);
    });
});

app.get("/comments/:imageId", (req, res) => {
    console.log("IN GET comments/:imageId, req.params: ", req.params);
    db.getAllComments(req.params.imageId)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("ERROR: PROBLEM WITH GET COMMENTS ", err);
        });
});

app.get("/moreImages/:id", (req, res) => {
    console.log("REQ.PARAMS.ID :", req.params.id);
    db.getMorePhotos(req.params.id)
        .then((result) => {
            console.log("RESULT.ROWS :", result.rows);
            res.json({
                payload: result.rows,
            });
        })
        .catch((err) => {
            console.log("ERROR WITH GETTING MORE PHOTOS ", err);
        });
});

app.post("/comment", (req, res) => {
    console.log("BODY in POST comment: ", req.body);
    if (req.body.comment && req.body.username) {
        db.addCommentToImg(
            req.body.comment,
            req.body.username,
            req.body.image_id
        )
            .then((result) => {
                res.json({
                    success: true,
                    payload: result.rows[0],
                });
            })
            .catch((err) => {
                console.log(
                    "ERROR: PROBLEM WITH ADDING THE COMMENT TO IMG ",
                    err
                );
            });
    }
});

app.post("/upload", uploader.single("image"), s3.upload, (req, res) => {
    console.log("IN UPLOAD...");
    console.log("req.body: ", req.body);
    console.log("TRY THISSSSSS: ", req.params.img);
    console.log("input:", req.body);
    console.log("*****************");
    console.log("POST /upload.json Route");
    console.log("*****************");
    console.log("file:", req.file);

    const url = `https://s3.amazonaws.com/spicedling/${req.file.filename}`;

    db.storeToImages(
        url,
        req.body.title,
        req.body.description,
        req.body.username
    )
        .then((results) => {
            res.json({ success: true, payload: results.rows[0] });
            console.log("MY PAYLOAD: ", results.rows[0]);
        })
        .catch((err) => {
            console.log("ERROR UPLOADING MY IMG: ", err);
        });
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening`));
