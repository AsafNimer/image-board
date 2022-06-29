const spicedPg = require("spiced-pg");
const database = "image_board";
const username = "postgres";
const password = "postgres";

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${username}:${password}@localhost:5432/${database}`
);
/*-------------------------------------------------
            MY QUERIES
---------------------------------------------------*/

module.exports.getImages = () => {
    return db.query(`SELECT * FROM images`);
};
