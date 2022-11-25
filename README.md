First time using Vue.js! Everyone can upload a picture (or comment a picture) from a beloved friend and add some information about the person, you can check it out at: https://serduszko.herokuapp.com/

BACKEND. In the backend, a Node.js Express server and a PostgreSQL database make sure everything is kept alive. The image board displayes the 9 most recent pictures, by hitting the more pictures button, more picutres will be loaded and displayed.

UPLOAD. New images get grabbed using Multer, then uploaded to AWS S3, with a reference stored in the database.

INTERACTION. One can visit a post's page, to interact with the author, ask questions, critique, praise, or simply share your thoughts in the comment section.

FRONTEND. In the front, Vue.js works its magic. Navigation to different pages is provided with Hash-Routing, so that posts can be sent to other places on the internet.
