const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Yetkisiz erişim"
    });
  }

  if (authHeader !== "secret123") {
    return res.status(403).json({
      message: "Geçersiz token"
    });
  }

  next();
};

module.exports = authMiddleware;