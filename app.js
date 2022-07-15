require('dotenv').config()

const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')

const app = express()
const port = process.env.PORT || 3000

const Minio = require('minio')

const mc = new Minio.Client({
    endPoint: process.env.MINIO_END_POINT,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: (process.env.MINIO_USE_SSL === 'true'),
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
});

app.use(cors());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    console.log('listing buckets...')

    try {
        const buckets = await mc.listBuckets();

        res.send(buckets)
    } catch (error) {
        console.error(error)
        res.send(error)
    }

})

app.post('/terserahlah', async (req, res) => {
    
    if (req.files === null) {
        res.status(400)
        res.send({message: 'File is empty'})

        return;
    }

    const file = req.files.file
    console.log(file)

    mc.putObject('terserahlah', file.name, file.data, file.size, function(err, objInfo) {
        if(err) {
            console.log(err)

            res.status(500)
            res.send({message: err})
        }
     console.log("Success", objInfo)

     res.status(200)
     res.send({message: 'Uploaded', ...objInfo})
    })

})



app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})