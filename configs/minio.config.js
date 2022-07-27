const minIOConfig = {
    endPoint: process.env.MINIO_END_POINT,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: (process.env.MINIO_USE_SSL === 'true'),
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
}

module.exports = minIOConfig