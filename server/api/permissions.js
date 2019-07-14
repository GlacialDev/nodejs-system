const permissionCtrl = require("../controllers/permission");
const errorHandler = require("./util/errorHandler");

module.exports = function(router) {
  router.put("/updateUserPermission/:id", async (req, res) => {
    try {
      const data = JSON.parse(req.body);
      const result = await permissionCtrl.update({ ...req.params, data });
      res.json(result);
    } catch (err) {
      errorHandler(err, res);
    }
  });
};
