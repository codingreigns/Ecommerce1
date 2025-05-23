require("express-async-errors");
require("dotenv/config");
const express = require("express");
const { NotFoundError, UnauthenticatedError } = require("./errors/index");
const connectDb = require("./db/connect");
const errorHandlerMiddleware = require("./middleware/error-handler");
const morgan = require("morgan");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");
const expressFileUpload = require("express-fileupload");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");

// security packages
app.set("trust proxy", 1); // trust first proxy
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
  })
);
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cors());
// middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));
app.use(expressFileUpload());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

app.get("/api/v1/home", (req, res) => {
  console.log(req.signedCookies);
  return res.send("hello world");
});

// errors
app.use(NotFoundError);
// app.use(UnauthenticatedError);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 4000;
let server = app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
  connectDb(process.env.MONGO_URL);
});

module.exports = server;
