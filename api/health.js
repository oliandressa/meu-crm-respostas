// api/health.js
export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const healthInfo = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    endpoints: {
      webhook: '/api/webhook',
      health: '/api/health',
      posts: '/api/posts',
      test: '/api/test'
    },
    message: '🚀 CRM Sistema Online - Pronto para receber webhooks!'
  };

  console.log('🏥 Health check realizado:', healthInfo);

  return res.status(200).json(healthInfo);
}
