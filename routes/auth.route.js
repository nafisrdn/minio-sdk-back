const { Router } = require("express");

const { MinIOClient } = require("../models/MinIOClient");

const router = Router();

router.post("/login", async (req, res) => {
  console.log(req.body);

  const { accessKey, secretKey } = req.body;
  const mc = new MinIOClient(accessKey, secretKey);

  try {
    mc.bucketExists("login", function (err, exists) {
      if (err) {
        console.log(err);
        res.status(401);
        res.send(err);
      }

      res.send(exists);
    });
  } catch (error) {
    console.error(error);
    res.status(401);
    res.send(error);
  }
});

module.exports = router;
