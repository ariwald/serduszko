//to use the database
const spicedPg = require("spiced-pg");
const db = spicedPg(
  process.env.DATABASE_URL ||
    "postgres:postgres:postgres@localhost:5432/imageBoard"
);

module.exports.getImages = function() {
  return db
    .query(
      `
        SELECT * FROM images ORDER BY id DESC LIMIT 9
        `
    )
    .then(({ rows }) => rows);
};

module.exports.getUpload = (title, description, username, url) => {
  return db
    .query(
      `
        INSERT INTO images (title, description, username, url)
        VALUES ($1, $2, $3, $4) RETURNING *
        `,
      [title, description, username, url]
    )
    .then(({ rows }) => rows);
};

module.exports.getSelectedImage = id => {
  return db
    .query(
      `SELECT *,
            (SELECT min(id) FROM images WHERE id>$1) AS "nextID",
            (SELECT max(id) FROM images WHERE id<$1) AS "previousID"
            FROM images
            WHERE id=$1`,
      [id]
    )
    .then(({ rows }) => rows);
};

module.exports.insertComment = (username, selectedImageId, comment) => {
  return db
    .query(
      `INSERT INTO comments (username, image_id, comment)
        VALUES ($1, $2, $3)
        RETURNING *`,
      [username, selectedImageId, comment]
    )
    .then(({ rows }) => rows);
};

module.exports.selectComments = function(selectedImageId) {
  return db
    .query(
      `SELECT username, comment FROM comments
        WHERE image_id=$1`,
      [selectedImageId]
    )
    .then(({ rows }) => rows);
};

module.exports.getMoreImages = function(lastId) {
  return db
    .query(
      `SELECT *, (
                    SELECT id FROM images
                    ORDER BY id ASC
                    LIMIT 1
                    ) AS "lowestId" FROM images
                    WHERE id < $1
                    ORDER BY id DESC
                    LIMIT 9`,
      [lastId]
    )
    .then(({ rows }) => rows);
};
