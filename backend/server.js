const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ✅ FIXED ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/teams", require("./routes/teamRoutes")); // IMPORTANT
app.use("/api/users", require("./routes/userRoutes"));
app.use("/uploads", express.static("uploads"));
app.use("/api/reports", require("./routes/reportRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
