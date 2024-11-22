const rolePermissions = {
  admin: [
    "view-event",
    "create-event",
    "update-event",
    "delete-event",
    "create-user",
    "analytic",
  ],
  "event-manager": [
    "view-event",
    "create-event",
    "update-event",
    "delete-event",
  ],
  user: ["view-event", "register-event"],
};

const authorize = (requiredPermission) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !rolePermissions[userRole]) {
      const error = new Error("Unauthorized");
      error.status = 403;
      throw error;
    }

    const userPermission = rolePermissions[userRole];
    const hasPermission = userPermission.includes(requiredPermission);

    if (!hasPermission) {
      const error = new Error("Unauthorized");
      error.status = 403;
      throw error;
    }

    next();
  };
};

module.exports.authorize = authorize;
