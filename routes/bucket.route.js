const { Router } = require("express");
const fs = require("fs");
const { MinIOClient } = require("../models/MinIOClient");

const router = Router();

router.get("/", async (req, res) => {
  console.log(req.body);
  const mc = new MinIOClient();

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
  const mc = new MinIOClient();

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

router.post("/:bucketName", async (req, res) => {
  const mc = new MinIOClient();

  const { bucketName } = req.params;

  if (req.files === null) {
    res.status(400);
    res.send({ message: "File is empty" });

    return;
  }

  const file = req.files.file;
  console.log(file);

  mc.putObject(
    bucketName,
    file.name,
    file.data,
    file.size,
    function (err, objInfo) {
      if (err) {
        console.log(err);

        res.status(500);
        res.send({ message: err });
      }
      console.log("Success", objInfo);

      res.status(200);
      res.send({ message: "Uploaded", ...objInfo });
    }
  );
});

router.delete("/:bucketName", (req, res) => {
  const mc = new MinIOClient();
  const { bucketName } = req.params;
  const { objectName } = req.body;

  console.log(req.body);

  mc.removeObject(bucketName, objectName, (error) => {
    console.log(error);
    if (error) {
      console.error(error);
      res.status(400);
      res.send(error);
    }

    console.log("a");
    res.status(200);
    res.send({ message: "Removed" });
  });
});

router.get("/:bucketName/object", (req, res) => {
  const mc = new MinIOClient();
  const { bucketName } = req.params;
  const { objectName, action, plain } = req.query;

  if (action === "download") {
    res.setHeader("Content-disposition", "attachment; filename=" + objectName);
  }

  if (plain) {
    res.setHeader("Content-Type", "text/plain");
  }

  mc.getObject(bucketName, objectName, function (err, dataStream) {
    console.log(dataStream);
    if (err) {
      console.log(err);
      res.send(err);
    }
    dataStream.on("data", function (chunk) {
      res.write(chunk);
    });
    dataStream.on("end", function () {
      
      res.end();
    });
    dataStream.on("error", function (err) {
      console.log(err);
      res.send(err);
    });
  });
});

module.exports = router;
