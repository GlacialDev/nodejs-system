const userCtrl = require("../controllers/user");
const errorHandler = require("./util/errorHandler");

const multer = require("multer");
const path = require("path");
const upload = multer({
  dest: path.resolve(process.cwd(), "/server/images/")
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

module.exports = function(router) {
  router.get("/getUsers", async (req, res, next) => {
    try {
      const result = await userCtrl.getUsers();
      res.json(result);
    } catch (err) {
      errorHandler(err, res);
    }
  });

  router.post("/saveNewUser", async (req, res) => {
    try {
      const user = JSON.parse(req.body);
      const result = await userCtrl.saveNewUser(user);
      res.json(result);
    } catch (err) {
      errorHandler(err, res);
    }
  });

  // router.get("/:id", async (req, res) => {
  //   try {
  //     const result = await usersCtrl.getOneUser({ ...req.params });
  //     res.json({
  //       data: result
  //     });
  //   } catch (err) {
  //     errorHandler(err, res);
  //   }
  // });

  router.put("/updateUser/:id", async (req, res) => {
    try {
      let body = JSON.parse(req.body);
      const result = await userCtrl.updateUser({ ...req.params, ...body });
      res.json(result);
    } catch (err) {
      errorHandler(err, res);
    }
  });

  router.post("/saveUserImage/:id", upload.any(), async (req, res) => {
    try {
      const result = await userCtrl.updateUserImage({
        ...req.params,
        ...req.files
      });

      res.json(result);
    } catch (err) {
      errorHandler(err, res);
    }
  });

  router.delete("/deleteUser/:id", async (req, res) => {
    try {
      const result = await userCtrl.deleteUser({ ...req.params });
      res.json(result);
    } catch (err) {
      errorHandler(err, res);
    }
  });
};
