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

module.exports.storeToImages = (url, title, description, username) => {
    const q = `INSERT INTO images (url, title, description, username) VALUES ($1, $2, $3, $4) RETURNING *`;
    const param = [url, title, description, username];
    return db.query(q, param);
};

module.exports.getSingleImg = (id) => {
    return db.query(`SELECT * FROM images WHERE id = $1`, [id]);
};
