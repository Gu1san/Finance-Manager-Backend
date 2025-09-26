function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  const now = new Date();

  if (isNaN(date.getTime())) return false; // Data inválida
  if (date > now) return false; // Data no futuro
  return true;
}

function isValidType(status) {
  const validType = ["entrada", "saida"];
  if (!validType.includes(status)) {
    return false;
  }
  return true;
}

function invalidPayloadResponse(res, error, message = "Parâmetros inválidos") {
  return res.status(400).json({
    status: 400,
    message: message,
    errors: error,
  });
}

module.exports = { isValidDate, isValidType, invalidPayloadResponse };
