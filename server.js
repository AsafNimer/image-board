const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer"); //NPM package. Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
const uidSafe = require("uid-safe"); //NPM package. Create cryptographically secure UIDs safe for both cookie and URL usage. Asynchronously create a UID with a specific byte length and return a Promise.
const path = require("path");
const s3 = require("./s3");
const moment = require("moment");

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
if (process.env.NODE_ENV == "production") {
    app.use((req, res, next) => {
        if (req.headers["x-forwarded-proto"].startsWith("https")) {
            return next();
        }
        res.redirect(`https://${req.hostname}${req.url}`);
    });
}

app.use(express.urlencoded({ extended: false })); // GIVES US AN ACCESS TO OUR FORM DATA, WITHOUT, MIDDLEWARE EXPRESS CAN'T INTERPRET IT

app.use(express.static("./public"));

app.use(express.json()); //This is a built-in middleware function in Express. It parses incoming requests with JSON payloads

app.get("/image_board", (req, res) => {
    db.getImages()
        .then((result) => {
            res.json(result.rows);
            console.log("check ittttttttt!!!!!!: ", result.rows);
        })
        .catch((err) => {
            console.log("error GET images", err);
        });
});

app.get("/image_board/:image", (req, res) => {
    db.getSingleImg(req.params.image).then((result) => {
        console.log("result.rows: TEST!!!", result.rows);
        result.rows[0].created_at = moment(result.rows[0].created_at).format(
            "MMM Do YY"
        );
        console.log("result.rows[0].created_at", result.rows[0].created_at);
        res.json(result.rows[0]);
    });
});

app.get("/comments/:imageId", (req, res) => {
    console.log("req.params in GET comments/:imageId: ", req.params);
    db.getAllComments(req.params.imageId)
        .then((result) => {
            console.log(result.rows);
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("error GET comments ", err);
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
            console.log("error with getting more images ", err);
        });
});

app.post("/comment", (req, res) => {
    console.log("req.body in POST /comment: ", req.body);
    if (req.body.comment && req.body.username) {
        db.addCommentToImg(
            req.body.comment,
            req.body.username,
            req.body.image_id
        )
            .then((result) => {
                console.log(result.rows[0]);
                res.json({
                    success: true,
                    payload: result.rows[0],
                });
            })
            .catch((err) => {
                console.log("error with adding comment to img", err);
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
            console.log("my payload: ", result.rows[0]);
        })
        .catch((err) => {
            console.log("error uploading img: ", err);
        });
});

app.delete("/removeImgAndComments/:id", (req, res) => {
    db.deleteComments(req.params.id)
        .then(() => {
            console.log("Comments removed", req.params.id);
            res.status(204).json({ success: true });
        })
        .catch((err) => {
            console.log("Error with deleteComments", err);
        })
        .then(() => {
            db.deleteImage(req.params.id)
                .then(() => {
                    console.log("Image removed", req.params.id);
                    return res.status(204).json({ success: true });
                })
                .catch((err) => {
                    console.log("error by deleting image1: ", err);
                });
        })
        .catch((err) => {
            console.log("error by deleting image2: ", err);
        });
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(process.env.PORT || 8080, () => console.log(`I'm listening`));
