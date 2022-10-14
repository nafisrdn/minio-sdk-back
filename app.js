require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const bucketRoute = require("./routes/bucket.route");

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send({
    status: 'success',
    message: 'Server is running'
  })
})

app.use("/bucket", bucketRoute);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

