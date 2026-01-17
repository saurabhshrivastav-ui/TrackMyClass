const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
// Load env from project root so `cd server && npm run dev` still works.
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
// Fallback to current working directory .env (no-op if already loaded)
require("dotenv").config();

const studentRoutes = require("./routes/students");
const userRoutes = require("./routes/users");

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const SESSION_SECRET = process.env.SECRET || "trackmyclass_secret";
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI. Set it in the root .env file (or server/.env). Example: MONGODB_URI=mongodb://127.0.0.1:27017/trackmyclass");
  process.exit(1);
}

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      collectionName: "sessions",
      touchAfter: 24 * 3600,
    }),
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "trackmyclass-server" });
});

app.use("/api/students", studentRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 4000;
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on ${PORT}`);
      console.log(`Access at: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
