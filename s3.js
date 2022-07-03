const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV === "production") {
    secrets = process.env;
} else {
    //this means we're running locally
    secrets = require("./moreSecrets.json");
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

module.exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("NO FILE ON REQUEST BODY");
        return res.sendStatus(500);
    }

    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "spicedling", //cloud folder
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            console.log("Yay it worked our image is in the cloud");
            next();
            fs.unlink(path, () => {});
        })
        .catch((err) => {
            console.log("SOMETHING WENT WRONG WITH THE UPLOAD CLOUD ", err);
            return res.sendStatus(500);
        });
};
