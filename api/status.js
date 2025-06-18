export default function handler(req, res) {
  return res.status(200).json({
    message: "CRM API funcionando!",
    timestamp: new Date().toISOString(),
    version: "1.0"
  });
}
