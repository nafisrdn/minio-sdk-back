require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const bucketeRoute = require("./routes/bucket.route");
const authRoute = require("./routes/auth.route");

const { MinIOClient } = require("./models/MinIOClient");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/bucket", bucketeRoute);

app.use("/auth", authRoute);

// app.get('/', async (req, res) => {
//     console.log('listing buckets...')

//     const {accessKey, secretKey} = req.body

//     const mc = new Minio.Client({
//         endPoint: process.env.MINIO_END_POINT,
//         port: parseInt(process.env.MINIO_PORT),
//         useSSL: (process.env.MINIO_USE_SSL === 'true'),
//         accessKey: accessKey,
//         secretKey: secretKey
//     });

//     try {
//         const buckets = await mc.listBuckets();

//         res.send(buckets)
//     } catch (error) {
//         console.error(error)
//         res.send(error)
//     }

// })

// app.post(`/${bucketName}`, async (req, res) => {

//     if (req.files === null) {
//         res.status(400)
//         res.send({message: 'File is empty'})

//         return;
//     }

//     const file = req.files.file
//     console.log(file)

//     mc.putObject(bucketName, file.name, file.data, file.size, function(err, objInfo) {
//         if(err) {
//             console.log(err)

//             res.status(500)
//             res.send({message: err})
//         }
//      console.log("Success", objInfo)

//      res.status(200)
//      res.send({message: 'Uploaded', ...objInfo})
//     })

// })

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

