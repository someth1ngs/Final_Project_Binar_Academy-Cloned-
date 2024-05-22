const jsonwebtoken = require("jsonwebtoken");
module.exports = {
  middleware: (req, res, next) => {
    try {
      if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        try {
          const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
          req.user_data = decoded;
          next();
        } catch {
          return res.status(401).json({
            status: 401,
            message: "Authentication failed, jwt invalid.",
            data: null,
          });
        }
      } else {
        return res.status(401).json({
          status: 401,
          message: "Authentication failed, please login.",
          data: null,
        });
      }
      /* c8 ignore start */
    } catch (error) {
      // console.log(error);
      next(error);
    }
  },
  isUser: (req, res, next) => {
    try {
      if (req.user_data.role !== "USER") {
        return res.status(401).json({
          status: 401,
          message: "Access denied for User. You dont have permission to the resource",
          data: null,
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  },
  isAdmin: (req, res, next) => {
    try {
      if (req.user_data.role !== "ADMIN") {
        return res.status(401).json({
          status: 401,
          message: "Access denied for Admin. You dont have permission to the resource",
          data: null,
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  },
};
