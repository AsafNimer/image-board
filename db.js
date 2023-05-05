const spicedPg = require("spiced-pg");
const database = "image_board";
const username = "postgres";
const password = "postgres";

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${username}:${password}@localhost:5432/${database}`
);

module.exports.getImages = () => {
    return db.query(`SELECT * FROM images ORDER BY id ASC
  LIMIT 6`);
};

module.exports.storeToImages = (url, title, description, username) => {
    const q = `INSERT INTO images (url, title, description, username) VALUES ($1, $2, $3, $4) RETURNING *`;
    const param = [url, title, description, username];
    return db.query(q, param);
};

module.exports.getSingleImg = (id) => {
    return db.query(`SELECT * FROM images WHERE id = $1`, [id]);
};

module.exports.getAllComments = (image_id) => {
    return db.query(
        `SELECT comments.comment, comments.username, comments.created_at
        FROM comments
        WHERE comments.image_id = $1`,
        [image_id]
    );
};

module.exports.addCommentToImg = (comment, username, image_id) => {
    const q = `INSERT INTO comments(comment, username, image_id)
     VALUES ($1, $2, $3)
     RETURNING *
    `;
    const param = [comment, username, image_id];
    return db.query(q, param);
};

module.exports.getMorePhotos = (id) => {
    return db.query(
        `SELECT url, title, id, (
            SELECT id FROM images
            ORDER BY id ASC
            LIMIT 1
        ) AS "lowestId"
        FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 3`,
        [id]
    );
};
