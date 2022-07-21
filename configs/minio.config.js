const minIOConfig = {
    endPoint: process.env.MINIO_END_POINT,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: (process.env.MINIO_USE_SSL === 'true')
}

module.exports = minIOConfig