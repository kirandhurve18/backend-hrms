const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const hrmsService = require("../services/hrms.service");
// Middleware to protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const query = {
        _id: decoded.userId,
      };

      const user = await hrmsService.findOneEmployee(query);
      // Check if user was found
      if (user.length === 0) {
        return res
          .status(401)
          .json({ message: "Not authorized, User Not Found!", success: false });
      }

      req.user = user._id; // Set user on request object for access in routes
      const roleQuery = {
        _id: user.role_id,
      };
      const userRole = await hrmsService.findOneRole(roleQuery);
      req.role = userRole.role_name;
      next();
    } catch (error) {
      //   console.error(error);
      return res
        .status(401)
        .json({ message: "Not authorized, token failed", success: false });
    }
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, No Token Provided", success: false });
  }
});

const checkSuperAdminAccess = asyncHandler(async (req, res, next) => {
  try {
    const role = req.role;
    if (role == "Super_Admin") {
      next();
    } else {
      return res
        .status(200)
        .json({
          message: "You Don't have a Permission To Access This...!",
          success: false,
        });
    }
  } catch (error) {
    //   console.error(error);
    return res
      .status(401)
      .json({ message: "You Don't have a Permission To Access This...!", success: false });
  }
});

const checkAdminAccess = asyncHandler(async (req, res, next) => {
  try {
    const role = req.role;
    if (role == "Admin" || role == "Super_Admin") {
      next();
    } else {
      return res
        .status(200)
        .json({
          message: "You Don't have a Permission To Access This...!",
          success: false,
        });
    }
  } catch (error) {
    //   console.error(error);
    return res
      .status(401)
      .json({ message: "You Don't have a Permission To Access This...!", success: false });
  }
});

const checkUserAccess = asyncHandler(async (req, res, next) => {
  try {
    const role = req.role;
    if (role == "Admin" || role == "Super_Admin" || role == "User") {
      next();
    } else {
      return res
        .status(200)
        .json({
          message: "You Don't have a Permission To Access This...!",
          success: false,
        });
    }
  } catch (error) {
    //   console.error(error);
    return res
      .status(401)
      .json({ message: "You Don't have a Permission To Access This...!", success: false });
  }
});

module.exports = { protect, checkSuperAdminAccess, checkAdminAccess, checkUserAccess };
