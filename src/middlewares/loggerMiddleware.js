const loggerMiddleware = (req, res, next) => {
  console.log("Yeni istek geldi");
  console.log("Method:", req.method);
  console.log("URL:", req.url);

  next();
};

module.exports = loggerMiddleware;