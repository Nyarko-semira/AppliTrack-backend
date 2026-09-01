const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        message: "You do not have permission to perform this action."
      });
    }

    next();
  };
};

module.exports = authorizeRole;