const db = require("./src/db"); // ajuste o caminho se necessário

db.raw("select current_database()")
  .then((res) => {
    console.log("Banco conectado:", res.rows[0].current_database);
    process.exit(0);
  })
  .catch((err) => {
    console.error("Erro:", err);
    process.exit(1);
  });
