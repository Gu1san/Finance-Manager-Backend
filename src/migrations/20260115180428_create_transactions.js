/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("transactions", (table) => {
    table.increments("id").primary();
    table.string("description").notNullable();
    table.decimal("amount", 10, 2).notNullable();
    table
      .enum("type", ["entrada", "saida"], {
        useNative: true,
        enumName: "transaction_type",
      })
      .notNullable();
    table.string("category").notNullable();
    table
      .integer("category_id")
      .unsigned()
      .references("id")
      .inTable("categories")
      .onDelete("SET NULL");
    table.date("date").notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("transactions");
};
