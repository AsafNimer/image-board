const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");

app.use(express.urlencoded({ extended: false })); // GIVES US AN ACCESS TO OUR FORM DATA, WITHOUT MIDDLEWARE EXPRESS CAN'T INTERPRET IT

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

// multer.diskStorage specifies functions that
// multer should use for determining the path
// and filename to use when saving files.
const storage = multer.diskStorage({
    // destination function tells multer to put
    // files in the uploads directory
    destination(req, file, callback) {
        callback(null, "uploads");
    },
    // filename function tells multer to use
    // as the file name the unique id generated
    // by the call to uidSafe with the extension of the original
    //  file name appended to it
    filename(req, file, callback) {
        //work here
        //create a random file name
        //pick up the file name extension and save it to
        uidSafe(24).then((randomString) => {
            //keep the original file extension
            console.log("file: ", file);
            const extname = path.extname(file.originalname);
            console.log("EXTNAME: ", extname);
            //you may want to use the extname method to be found on the core path library.
            //to be found on the properties on the 'file' obj when i console log it.
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

app.post("/upload", uploader.single("image"), s3.upload, (req, res) => {
    console.log("IN UPLOAD...");
    console.log("req.body: ", req.body);
    console.log("input:", req.body);
    console.log("*****************");
    console.log("POST /upload.json Route");
    console.log("*****************");
    console.log("file:", req.file);

    if (!req.body.title) {
        res.json({ error: "missing field title!" });
        return;
    }
    if (!req.body.description) {
        res.json({ error: "missing field description!" });
        return;
    }
    if (!req.body.username) {
        res.json({ error: "missing field user!" });
        return;
    }

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
