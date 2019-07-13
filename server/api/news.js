const newsCtrl = require("../controllers/new");
const errorHandler = require("./util/errorHandler");

module.exports = function(router) {
  router.get("/getNews", async (req, res, next) => {
    try {
      const result = await newsCtrl.getNews();
      res.json(result);
    } catch (err) {
      errorHandler(err, res);
    }
  });

  router.post("/newNews", async (req, res, next) => {
    try {
      const newPost = JSON.parse(req.body);
      const result = await newsCtrl.newNews(newPost);
      res.json(result);
    } catch (err) {
      errorHandler(err, res);
    }
  });

  router.put("/updateNews/:id", async (req, res, next) => {
    try {
      let body = JSON.parse(req.body);
      const result = await newsCtrl.updateNews({ ...req.params, ...body });
      res.json(result);
    } catch (err) {
      errorHandler(err, res);
    }
  });

  router.delete("/deleteNews/:id", async (req, res, next) => {
    try {
      const result = await newsCtrl.deleteNews({ ...req.params });
      res.json(result);
    } catch (err) {
      errorHandler(err, res);
    }
  });
};
