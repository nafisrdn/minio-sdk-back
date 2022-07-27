require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const bucketeRoute = require("./routes/bucket.route");
const authRoute = require("./routes/auth.route");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/bucket", bucketeRoute);

app.use("/auth", authRoute);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

