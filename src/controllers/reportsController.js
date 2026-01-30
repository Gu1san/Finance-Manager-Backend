const repo = require("../repositories/reportsRepository");
const {
  isValidType,
  invalidPayloadResponse,
} = require("../utils/errorHandler");

async function getReportsByCategory(req, res) {
  try {
    const userId = req.user.id;

    const result = await repo.getByCategory(userId);

    if (result.length === 0)
      return res.status(404).json({ error: "Nenhuma transação encontrada" });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: `Erro ao gerar relatório: ${err}` });
  }
}

async function getReportsByType(req, res) {
  try {
    const userId = req.user.id;
    const { type } = req.query;

    if (!isValidType(type)) {
      return invalidPayloadResponse(res, {
        error: "Tipo inválido. Use 'entrada' ou 'saida'.",
      });
    }

    const result = await repo.getByType(userId, type);

    if (result.transactions.length === 0)
      return res
        .status(404)
        .json({ error: "Nenhuma transação encontrada para o tipo" });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: `Erro ao gerar relatório: ${err}` });
  }
}

module.exports = {
  getReportsByCategory,
  getReportsByType,
};
