module.exports = function(err, res) {
  console.error("err", err);
  res.status(err.statusCode || 500).json({
    message: err ? (err.message || err).toString() : "Internal Error"
  });
};
