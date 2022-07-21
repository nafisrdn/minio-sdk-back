const { Router } = require("express");

const { MinIOClient } = require("../models/MinIOClient");

const router = Router();

router.get("/", async (req, res) => {
  const { accessKey, secretKey } = req.body;
  const mc = new MinIOClient(accessKey, secretKey);

  try {
    const buckets = await mc.listBuckets();
    res.send(buckets);
  } catch (error) {
    console.error(error);
    res.status(401);
    res.send(error);
  }
});

router.get("/:bucketName", async (req, res) => {
  const { accessKey, secretKey } = req.body;
  const mc = new MinIOClient(accessKey, secretKey);

  const { bucketName } = req.params;

  let data = [];
  const stream = mc.listObjects(bucketName, "", true);
  stream.on("data", (obj) => {
    data.push(obj);
  });
  stream.on("end", () => {
    res.send(data);
  });
  stream.on("error", (err) => {
    console.error(err);
    res.status(500);
    res.send(err);
  });
});

module.exports = router;
