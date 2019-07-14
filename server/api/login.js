const loginCtrl = require("../controllers/login");
const errorHandler = require("./util/errorHandler");

module.exports = function(router) {
  router.post("/login", async (req, res) => {
    try {
      let data = JSON.parse(req.body);
      const result = await loginCtrl.login(data, res);
      res.json(result);
    } catch (err) {
      errorHandler(err, res);
    }
  });

  router.post("/authFromToken", async (req, res) => {
    try {
      let data = JSON.parse(req.body);
      const result = await loginCtrl.authFromToken(data);
      res.json(result);
    } catch (err) {
      errorHandler(err, res);
    }
  });
};
