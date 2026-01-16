const express = require("express");
const cors = require("cors");
require("dotenv").config();

const transactionsRoutes = require("./routes/transactionsRoutes");
const filesRoutes = require("./routes/filesRoutes");
const reportsRoutes = require("./routes/reportsRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

//Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());

//Routes
app.use("/transactions", transactionsRoutes);
app.use("/files", filesRoutes);
app.use("/reports", reportsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
