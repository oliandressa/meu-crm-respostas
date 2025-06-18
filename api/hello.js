export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Responder OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Resposta principal
  try {
    res.status(200).json({
      success: true,
      message: "🎉 CRM API funcionando!",
      timestamp: new Date().toISOString(),
      endpoint: "/api/hello"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
