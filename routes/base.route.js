const {Router} = require('express')

const { MinIOClient } = require('../models/MinIOClient')

const router = Router()

router.get('/', async (req, res) => {
    const {accessKey, secretKey} = req.body
    const mc = new MinIOClient(accessKey, secretKey)

    try {
        const buckets = await mc.listBuckets()
        res.send(buckets)
    } catch (error) {
        console.error(error)
        res.status(401)
        res.send(error)
    }
})

module.exports = router