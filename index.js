const express = require("express");
const app = express();
const db = require("./db");
const s3 = require("./s3");
const { s3Url } = require("./config");

app.use(express.static("./public"));

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

// DO NOT TOUCH
//boilerplate code for image upload
//render the file and upload to the computer
const diskStorage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, __dirname + "/uploads");
  },
  filename: function(req, file, callback) {
    uidSafe(24).then(function(uid) {
      callback(null, uid + path.extname(file.originalname));
    });
  }
});

const uploader = multer({
  storage: diskStorage,
  limits: {
    //2 mb file
    fileSize: 2097152
  }
});
// DO NOT TOUCH
// DO NOT TOUCH
// DO NOT TOUCH

app.use(express.json());

app.get("/images", (req, res) => {
  db.getImages()
    .then(data => {
      console.log("get images data: ", data);
      res.json(data);
    })
    .catch(function(err) {
      console.log("err axios:", err);
    });
});

//single to get only one file
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
  console.log("file: ", req.file);
  console.log("input: ", req.body);

  console.log("req.body.title; ", req.body.title);
  db.getUpload(
    req.body.title,
    req.body.description,
    req.body.username,
    s3Url + req.file.filename
  )
    .then(data => {
      console.log("data upload: ", data);
      res.json(data);
    })
    .catch(function(err) {
      console.log("err insert sdb:", err);
    });
});

app.get("/selectedImage/:id", (req, res) => {
  db.getSelectedImage(req.params.id)
    .then(data => {
      console.log("data selectedImage: ", data);
      res.json(data[0]);
    })
    .catch(function(err) {
      console.log("err axios:", err);
    });
});

app.post("/newComment", (req, res) => {
  console.log("newComment: ", req.body);
  if (req.body.username && req.body.comment) {
    db.insertComment(req.body.username, req.body.id, req.body.comment)
      .then(data => {
        console.log("insertComment: ", data);
        res.json(data);
      })
      .catch(err => console.log("err in insertComment: ", err));
  } else {
    res.json({
      success: false
    });
  }
});

app.get("/selectComment/:id", (req, res) => {
  db.selectComments(req.params.id)
    .then(data => {
      console.log("data selectedComment: ", data);
      res.json(data);
    })
    .catch(function(err) {
      console.log("err axios:", err);
    });
});

app.get("/more/:lastId", (req, res) => {
  console.log("req.params.lastId: ", req.params.lastId);
  var lastId = req.params.lastId;

  db.getMoreImages(lastId)
    .then(results => {
      console.log("results from getMoreImages ", results);
      res.json(results);
    })
    .catch(err => {
      console.log("err: ", err);
    });
});

app.listen(process.env.PORT || 8080, () => console.log(`it runs`));
