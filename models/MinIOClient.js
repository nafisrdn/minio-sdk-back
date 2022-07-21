const { endPoint, port, useSSL } = require("../configs/minio.config");

const { Client } = require("minio");

class MinIOClient extends Client {
  constructor(accessKey, secretKey) {
    super({
      endPoint,
      port,
      useSSL,
      accessKey,
      secretKey,
    });
  }
}

exports.MinIOClient = MinIOClient