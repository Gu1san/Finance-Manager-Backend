const { verifyToken } = require("../utils/jwt");

function ensureAuthenticated(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = {
  ensureAuthenticated,
};
