const repo = require('../repositories/reportsRepository');
const { isValidDate } = require('../utils/errorHandler');

function getPeriod(req) {
  const { from, to } = req.query;

  if (from && !isValidDate(from)) {
    return {
      error: 'Data inicial inválida',
    };
  }

  if (to && !isValidDate(to)) {
    return {
      error: 'Data final inválida',
    };
  }

  if (from && to && new Date(from) > new Date(to)) {
    return {
      error: 'A data inicial deve ser anterior à data final',
    };
  }

  return {
    from,
    to,
  };
}

async function getSummary(req, res) {
  try {
    const period = getPeriod(req);

    if (period.error) {
      return res.status(400).json({
        error: period.error,
      });
    }

    const result = await repo.getSummary(req.user.id, period.from, period.to);

    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: `Erro ao gerar resumo: ${err.message}`,
    });
  }
}

async function getExpensesByCategory(req, res) {
  try {
    const period = getPeriod(req);

    if (period.error) {
      return res.status(400).json({
        error: period.error,
      });
    }

    const result = await repo.getExpensesByCategory(
      req.user.id,
      period.from,
      period.to,
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: `Erro ao gerar relatório: ${err.message}`,
    });
  }
}

async function getIncomeByCategory(req, res) {
  try {
    const period = getPeriod(req);

    if (period.error) {
      return res.status(400).json({
        error: period.error,
      });
    }

    const result = await repo.getIncomeByCategory(
      req.user.id,
      period.from,
      period.to,
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: `Erro ao gerar relatório: ${err.message}`,
    });
  }
}

async function getBalanceEvolution(req, res) {
  try {
    const period = getPeriod(req);

    if (period.error) {
      return res.status(400).json({
        error: period.error,
      });
    }

    const result = await repo.getBalanceEvolution(
      req.user.id,
      period.from,
      period.to,
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: `Erro ao gerar evolução do saldo: ${err.message}`,
    });
  }
}

module.exports = {
  getSummary,
  getExpensesByCategory,
  getIncomeByCategory,
  getBalanceEvolution,
};
