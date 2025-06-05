// This middleware checks if the request has an admin header set to true.

const adminAccess = (req, res, next) => {
  const isAdmin = req.headers["x-admin"]; // Check if the request has an admin header
  if (isAdmin === "true") return next();
  return res.status(403).json({ error: "Only admins can perform this action" });
};

export default adminAccess;
