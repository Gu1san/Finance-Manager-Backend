const express = require("express");
const cors = require("cors");
require("dotenv").config();

const transactionsRoutes = require("./routes/transactionsRoutes");
const filesRoutes = require("./routes/filesRoutes");
const reportsRoutes = require("./routes/reportsRoutes");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");

const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL, // URL do frontend em produção
  "https://finance-manager-frontend-alsvezrpq.vercel.app",
];

console.log("Iniciando servidor...");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);

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

console.log("Rotas carregadas");

db.raw("SELECT 1")
  .then(() => {
    console.log("Banco conectado");

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro banco:", err);
  });
