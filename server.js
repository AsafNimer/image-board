const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer"); //NPM package. Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
const uidSafe = require("uid-safe"); //NPM package. Create cryptographically secure UIDs safe for both cookie and URL usage. Asynchronously create a UID with a specific byte length and return a Promise.
const path = require("path");
const s3 = require("./s3");

//********************** Multer Config ****************************/
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, "uploads");
    },
    filename(req, file, callback) {
        uidSafe(24).then((randomString) => {
            const extname = path.extname(file.originalname);
            callback(null, `${randomString}${extname}`);
        });
    },
});

//proccess out img data we're getting
const uploader = multer({
    storage,
    limits: {
        fileSize: 2097152,
    },
});
//********************************************* */

app.use(express.urlencoded({ extended: false })); // GIVES US AN ACCESS TO OUR FORM DATA, WITHOUT, MIDDLEWARE EXPRESS CAN'T INTERPRET IT

app.use(express.static("./public"));

app.use(express.json()); //This is a built-in middleware function in Express. It parses incoming requests with JSON payloads

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
            console.log("ERROR WITH GET COMMENTS ", err);
        });
});

app.get("/moreImages/:id", (req, res) => {
    console.log("REQ.PARAMS.ID :", req.params.id);
    db.getMorePhotos(req.params.id)
        .then((result) => {
            console.log("RESULT.ROWS :", result.rows);
            res.json({
                success: true,
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

// The string passed to 'single' below is the name of the field in the request (name attribute on 'input' field).
app.post("/upload", uploader.single("image"), s3.upload, (req, res) => {
    const url = `https://s3.amazonaws.com/spicedling/${req.file.filename}`;

    db.storeToImages(
        url,
        req.body.title,
        req.body.description,
        req.body.username
    )
        .then((result) => {
            res.json({ success: true, payload: result.rows[0] });
            console.log("MY PAYLOAD: ", result.rows[0]);
        })
        .catch((err) => {
            console.log("ERROR UPLOADING MY IMG: ", err);
        });
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening`));
