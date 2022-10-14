const { Router } = require("express");
const { MinIOClient } = require("../models/MinIOClient");

const router = Router();

router.get("/", async (req, res) => {
  const mc = new MinIOClient();

  const logMessage = "Get all buckets";

  try {
    const buckets = await mc.listBuckets();
    console.log(`Success: ${logMessage}`);
    res.send(buckets);
  } catch (error) {
    console.error(`Error: ${logMessage}`);
    console.error(error);
    res.status(500);
    res.send(error);
  }
});

router.get("/:bucketName", async (req, res) => {
  const mc = new MinIOClient();

  const { bucketName } = req.params;

  const logMessage = `Get ${bucketName} bucket objects`;

  let data = [];
  const stream = mc.listObjectsV2(bucketName, "", true);
  stream.on("data", (obj) => {
    data.push(obj);
  });
  stream.on("end", () => {
    console.log(`Success: ${logMessage}`);
    res.send(data);
  });
  stream.on("error", (err) => {
    console.error(`Error: ${logMessage}`);
    console.error(err);
    res.status(500);
    res.send(err);
  });
});

router.post("/:bucketName", async (req, res) => {
  const mc = new MinIOClient();

  const { bucketName } = req.params;

  const logMessage = `Upload object to ${bucketName} bucket`;

  if (!req.files || !req.files.file) {
    console.error(`Error: ${logMessage}`);

    res.writeHead(400);
    res.send({ message: "File is empty" });

    return;
  }

  const file = req.files.file;

  mc.putObject(
    bucketName,
    file.name,
    file.data,
    file.size,
    function (err, objInfo) {
      if (err) {
        console.error(`Error: ${logMessage}`);
        console.log(err);

        res.status(500);
        res.send({ message: err });
      }
      console.log(`Success: ${logMessage}`);
      console.log(objInfo);

      res.status(200);
      res.send({ message: "Uploaded", ...objInfo });
    }
  );
});

router.delete("/:bucketName", async (req, res) => {
  const mc = new MinIOClient();
  const { bucketName } = req.params;
  const { objectName } = req.body;

  if (!objectName) {
    res.status(400);
    return res.send({ message: "Object name null" });
  }

  const logMessage = `Delete ${objectName} in ${bucketName} bucket`;

  mc.removeObject(bucketName, objectName, (error) => {
    if (error) {
      console.error(`Error: ${logMessage}`);
      console.error(error);
      res.status(400);
      return res.send(error);
    }

    console.log(`Success: ${logMessage}`);
    res.status(200);
    res.send({ message: "Removed" });
  });
});

router.get("/:bucketName/object", (req, res) => {
  const mc = new MinIOClient();
  const { bucketName } = req.params;
  const { objectName, action, plain } = req.query;

  const logMessage = `get ${objectName} in ${bucketName} bucket`;

  if (action === "download") {
    res.setHeader("Content-disposition", "attachment; filename=" + objectName);
  }

  if (plain) {
    res.setHeader("Content-Type", "text/plain");
  }

  mc.getObject(bucketName, objectName, function (err, dataStream) {
    if (err) {
      console.error(`Error: ${logMessage}`);
      console.log(err);
      return res.send(err);
    }
    dataStream.on("data", function (chunk) {
      res.write(chunk);
    });
    dataStream.on("end", function () {
      console.error(`Success: ${logMessage}`);
      res.end();
    });
    dataStream.on("error", function (err) {
      console.error(`Error: ${logMessage}`);

      console.log(err);
      return res.send(err);
    });
  });
});

module.exports = router;
