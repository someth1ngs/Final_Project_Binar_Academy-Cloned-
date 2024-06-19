// Module
require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const yaml = require("yaml");
const swaggerUI = require("swagger-ui-express");
const fs = require("fs");

const indexRouter = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 4000;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const options = { customCssUrl: "/api-docs/swagger-ui.css", customSiteTitle: "NgeFly Documentation API" };

// Swagger
const file = fs.readFileSync(`${__dirname}/api-docs.yaml`, "utf-8");
const swaggerDocument = yaml.parse(file);
app.use(`/api-docs`, swaggerUI.serve);
app.get("/api-docs", swaggerUI.setup(swaggerDocument, { customJs: ["/api-docs/swagger-ui-bundle.js", "/api-docs/swagger-ui-standalone-preset.js"], customfavIcon: "/api-docs/favicon-32x32.png", ...options }));

// Route
app.use("/api/v1", indexRouter);

// 500 error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    status: false,
    message: err.message,
    data: null,
  });
});

// 404 error handler
app.use((req, res, next) => {
  res.status(404).json({
    status: false,
    message: `are you lost? ${req.method} ${req.url} is not registered!`,
    data: null,
  });
});

app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

module.exports = app;
