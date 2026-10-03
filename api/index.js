const app = require("../backend/src/app");

module.exports = (req, res) => {
  app.emit("request", req, res);
};
