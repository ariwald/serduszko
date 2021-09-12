(function() {
  //all inside vue component is child
  Vue.component("first-component", {
    template: "#image-template",
    //listening the props
    props: ["postTitle", "id"],
    data: function() {
      return {
        selectedImage: null,
        username: null,
        comment: null,
        comments: [],
        nextID: null,
        previousID: null,
        heading: "Serduszka Fotos"
        // count: 0
      };
    },
    mounted: function() {
      console.log("mounted: ");
      console.log("my postTitle: ", this.postTitle);
      console.log("id :", this.id);
      var vueInstanceC = this;

      axios
        .get("/selectedImage/" + this.id)
        .then(function(res) {
          vueInstanceC.selectedImage = res.data;
          console.log("resssssss: ", res.data);
          vueInstanceC.previousID = res.data.previousID;
          vueInstanceC.nextID = res.data.nextID;
        })
        .catch(function(err) {
          console.log("err axios:", err);
        });
      axios
        .get("/selectComment/" + this.id)
        .then(function(res) {
          console.log("comment, please stay on the page: ", res);
          console.log("comments = : ", vueInstanceC.comments);
          vueInstanceC.comments = res.data;
        })
        .catch(function(err) {
          console.log("err: ", err);
        });
    },
    watch: {
      id: function() {
        console.log("mounted: ");
        console.log("my postTitle: ", this.postTitle);
        var vueInstance = this;

        axios
          .get("/selectedImage/" + this.id)
          .then(function(res) {
            console.log("id :", this.id);
            if (res.data == 0) {
              vueInstance.$emit("close");
            }
            vueInstance.selectedImage = res.data;
            vueInstance.previousID = res.data.previousID;
            vueInstance.nextID = res.data.nextID;
          })
          .catch(function(err) {
            console.log("err axios:", err);
          });

        axios
          .get("/selectComment/" + this.id)
          .then(function(res) {
            console.log("comment, please stay on the page: ", res);
            console.log("comments = : ", vueInstance.comments);
            vueInstance.comments = res.data;
          })
          .catch(function(err) {
            console.log("err: ", err);
          });
      }
    },

    methods: {
      closeModal: function() {
        console.log("sanity check: click worked");
        //child send a message to parent
        this.nextId = null;
        this.prevId = null;
        this.$emit("close", this.imageId);
      },
      handleClickComment: function(e) {
        e.preventDefault();
        var vueInstanceD = this;

        console.log("stuff to be posted/username: ", this.username);
        console.log("stuff to be posted/comment: ", this.comment);

        axios
          .post("/newComment", {
            username: this.username,
            comment: this.comment,
            id: this.id
          })
          .then(function(res) {
            console.log("vueInstanceD.comments: ", vueInstanceD.comments);
            vueInstanceD.comments.unshift(res.data[0]);
            vueInstanceD.username = "";
            vueInstanceD.comment = "";
          })
          .catch(function(err) {
            console.log("err in POST /newComment: ", err);
          });
      }
    }
  });
  //all inside main is the parent
  new Vue({
    el: "#main",
    data: {
      //before it was null, now it is hash routed
      selectedImage: location.hash.slice(1),
      heading: "Serduszka Fotos",
      images: [],
      mainContainer: "mainContainer",
      imageContainer: "imageContainer",
      hideButton: false,
      pic: "pic",
      title: "",
      description: "",
      username: null,
      file: null,
      lastId: null
    },
    created: function() {
      console.log("created");
    },
    mounted: function() {
      console.log("mounted");
      var vueInstance = this;
      addEventListener("hashchange", function() {
        console.log("hash change happened");
        vueInstance.selectedImage = location.hash.slice(1);
      });
      axios
        .get("/images")
        .then(function(res) {
          vueInstance.images = res.data;
          var latestPic = res.data.length - 1;
          var latestPicId = res.data[latestPic].id;
          vueInstance.lastId = latestPicId;
        })
        .catch(function(err) {
          console.log("err axios:", err);
        });
    },

    methods: {
      closeMe: function(id) {
        console.log("need to close the modal, id: ", id);
        // this.selectedImag = null;
        this.selectedImage = null;
        // location.hash = "";
        history.replaceState(null, null, " ");
      },
      handleClick: function(e) {
        e.preventDefault();
        var formData = new FormData();
        formData.append("title", this.title);
        formData.append("description", this.description);
        formData.append("username", this.username);
        formData.append("file", this.file);

        //this console.log should return nothing, it comes an empty object
        // console.log("formData: ", formData);
        var vueInstanceB = this;
        axios
          .post("/upload", formData)
          .then(function(res) {
            vueInstanceB.images.unshift(res.data[0]);
            vueInstanceB.title = "";
            vueInstanceB.description = "";
            vueInstanceB.username = "";
            vueInstanceB.file = "";
          })
          .catch(function(err) {
            console.log("err in post upload:", err);
          });
      },

      handleChange: function(e) {
        console.log("handleChange is running");
        console.log("file:", e.target.files[0]);
        this.file = e.target.files[0];
      },
      handleImageChange: function(e) {
        console.log("handleImageChange is running");
        console.log("file:", e.target.files[0]);
        this.file = e.target.files[0];
      },

      more: function(e) {
        e.preventDefault();
        var vueInstance = this;
        console.log("more button clicked");

        axios.get("/more/" + this.lastId).then(function(results) {
          for (var i = 0; i < results.data.length; i++) {
            vueInstance.images.push(results.data[i]);
          }
          console.log("results.data :", results.data);
          vueInstance.lastId = results.data[results.data.length - 1].id;
          if (results.data[0].lowestId === vueInstance.lastId) {
            console.log("r u running? :");
            vueInstance.hideButton = true;
          } else {
            vueInstance.hideButton = false;
          }
        });
      }
    }
  });
})();
