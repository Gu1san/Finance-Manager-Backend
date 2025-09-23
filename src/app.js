const express = require("express");
const cors = require("cors");
require("dotenv").config();

const transactionsRoutes = require("./routes/transactionsRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

//Middlewares
app.use(cors());
app.use(express.json());

//Routes
app.use("/transactions", transactionsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
