const db = require("./src/db");

async function initDb() {
  // Tabela de categorias
  const hasCategories = await db.schema.hasTable("categories");
  if (!hasCategories) {
    await db.schema.createTable("categories", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
    });
  }

  // Tabela de transações
  const hasTransactions = await db.schema.hasTable("transactions");
  if (!hasTransactions) {
    await db.schema.createTable("transactions", (table) => {
      table.increments("id").primary();
      table.string("description").notNullable();
      table.decimal("amount", 10, 2).notNullable();
      table.enum("type", ["entrada", "saida"]).notNullable();
      table.string("category").notNullable();
      table
        .integer("category_id")
        .unsigned()
        .references("id")
        .inTable("categories");
      table.timestamp("date").defaultTo(db.fn.now());
    });
  }

  console.log("Banco inicializado com sucesso!");
}

initDb();
