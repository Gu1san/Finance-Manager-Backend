const express = require("express");
const cors = require("cors");
require("dotenv").config();

const transactionsRoutes = require("./routes/transactionsRoutes");
const filesRoutes = require("./routes/filesRoutes");
const reportsRoutes = require("./routes/reportsRoutes");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL, // URL do frontend em produção
  "https://finance-manager-frontend-alsvezrpq.vercel.app",
];

//Middlewares
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/transactions", transactionsRoutes);
app.use("/files", filesRoutes);
app.use("/reports", reportsRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
