const {
  endPoint,
  port,
  useSSL,
  accessKey,
  secretKey,
} = require("../configs/minio.config");

const { Client } = require("minio");

class MinIOClient extends Client {
  constructor() {
    super({
      endPoint,
      port,
      useSSL,
      accessKey: accessKey,
      secretKey: secretKey,
    });
  }
}

exports.MinIOClient = MinIOClient;
