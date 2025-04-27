const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const fetchPosts = require("./utils/fetchPosts");
const feedRouter = require("./routes/feed");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://vertx-ai.vercel.app"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/feed", feedRouter);
connectDB()
  .then(() => {
    console.log("Database Connection Established...");
    // server needs to be run after successful database connection
    fetchPosts();
    // setInterval(fetchPosts, 30 * 60 * 1000);
    app.listen(process.env.PORT, (req, res) => {
      console.log(`Server listening on port ${process.env.PORT}...`);
    });
  })
  .catch((err) => console.error("Database Cannot be connected "));
